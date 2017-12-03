import { Component, ContentChildren, ElementRef, EventEmitter, Output, QueryList, ViewChild } from '@angular/core';
import { UIOptionComponent } from '../option/option.component';
import { DOWN_ARROW, TAB, UP_ARROW } from '../../../common/key-codes';
import { Subject } from 'rxjs/Subject';


@Component({
    selector: 'ui-autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.less'],
    exportAs: 'uiAutocomplete'
})
export class UIAutocompleteComponent {
    @ViewChild('panel') panel: ElementRef;
    @ContentChildren(UIOptionComponent, { descendants: true }) items: QueryList<UIOptionComponent>;
    activeItemIndex = -1;
    activeItem: UIOptionComponent;
    tabOut = new Subject<void>();
    showPanel = false;
    _isOpen = false;

    get isOpen(): boolean {
        return this._isOpen && this.showPanel;
    }

    onKeyDown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case DOWN_ARROW:
                this.setNextItemActive();
                break;
            case UP_ARROW:
                this.setPreviousItemActive();
                break;
            case TAB:
                this.tabOut.next();
                return;
        }

        event.preventDefault();
    }

    setVisibility() {
        this.showPanel = !!this.items.length;
    }

    setActiveItem(index: number) {
        if (this.activeItem) {
            this.activeItem.deactivate();
        }

        this.activeItemIndex = index;
        this.activeItem = this.items.toArray()[index];
        this.activeItem.activate();
    }

    setFirstItemActive() {
        this.setActiveItemByIndex(0, 1);
    }

    setLastItemActive() {
        this.setActiveItemByIndex(this.items.length - 1, -1);
    }

    setNextItemActive() {
        this.activeItemIndex < 0 ? this.setFirstItemActive() : this.setActiveItemByDelta(1);
    }

    setPreviousItemActive(): void {
        this.activeItemIndex < 0 ? this.setLastItemActive() : this.setActiveItemByDelta(-1);
    }

    setScrollTop(scrollTop: number) {
        if (this.panel) {
            this.panel.nativeElement.scrollTop = scrollTop;
        }
    }

    resetActiveItem() {
        this.setActiveItem(-1);
    }

    getScrollTop(): number {
        return this.panel ? this.panel.nativeElement.scrollTop : 0;
    }

    scrollToActiveItem() {
        const activeOptionIndex = this.activeItemIndex || 0;
        const optionOffset = activeOptionIndex * 32;
        const panelTop = this.getScrollTop();

        if (optionOffset < panelTop) {
            // Scroll up to reveal selected option scrolled above the panel top
            this.setScrollTop(optionOffset);
        } else if (optionOffset + 32 > panelTop + 300) {
            // Scroll down to reveal selected option scrolled below the panel bottom
            const newScrollTop = optionOffset - 300 + 32;
            this.setScrollTop(Math.max(0, newScrollTop));
        }
    }

    clearSelectedItem(skip: UIOptionComponent) {
        this.items.forEach((item) => {
            if (item !== skip && item.selected) {
                item.deselect();
            }
        });
    }

    private setActiveItemByDelta(delta: number) {
        this.activeItemIndex =
            (this.activeItemIndex + delta + this.items.length) % this.items.length;

        // skip all disabled menu items recursively until an enabled one is reached
        if (this.items[this.activeItemIndex].disabled) {
            this.setActiveItemByDelta(delta);
        } else {
            this.setActiveItem(this.activeItemIndex);
        }
    }

    private setActiveItemByIndex(index: number, fallbackDelta: number) {
        const items = this.items.toArray();

        if (!items[index]) {
            return;
        }
        while (items[index].disabled) {
            index += fallbackDelta;

            if (!items[index]) {
                return;
            }
        }
        this.setActiveItem(index);
    }
}
