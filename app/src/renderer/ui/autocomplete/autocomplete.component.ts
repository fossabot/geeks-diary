import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DOWN_ARROW, TAB, UP_ARROW } from '../../../common/key-codes';
import { Observable } from 'rxjs/Observable';


export interface OptionItem {
    id?: any;
    name: string;
    value: any;
}


@Component({
    selector: 'ui-autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.less'],
    exportAs: 'uiAutocomplete'
})
export class AutocompleteComponent implements OnDestroy {
    @ViewChild('panel') panel: ElementRef;
    @Input() options: OptionItem[] = [];

    private _itemSelections = new Subject<OptionItem>();
    activeItemIndex = -1;
    activeItem = null;
    tabOut = new Subject<void>();
    showPanel = false;
    _isOpen = false;

    get isOpen(): boolean {
        return this._isOpen && this.showPanel;
    }

    get itemSelections(): Observable<OptionItem> {
        return this._itemSelections.asObservable();
    }

    ngOnDestroy() {
        this._itemSelections.complete();
    }

    onKeydown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case DOWN_ARROW:
                this.setNextItemActive();
                event.preventDefault();
                break;
            case UP_ARROW:
                this.setPrevItemActive();
                event.preventDefault();
                break;
            case TAB:
                return;
        }
    }

    isItemActivate(item: OptionItem) {
        return this.activeItem === item;
    }

    setVisibility() {
        this.showPanel = !!this.options.length;
    }

    setActiveItem(index: number) {
        if (this.activeItem) {
            this.activeItem = null;
        }

        this.activeItemIndex = index;
        this.activeItem = this.options[this.activeItemIndex];
    }

    setNextItemActive() {
        if (this.activeItemIndex < 0) {
            this.setActiveItem(0);
        } else {
            let nextIndex = this.activeItemIndex + 1;

            if (nextIndex > this.options.length - 1) {
                nextIndex--;
            }

            this.setActiveItem(nextIndex);
        }
    }

    setPrevItemActive() {
        if (this.activeItemIndex < 0) {
            this.setActiveItem(this.options.length - 1);
        } else {
            let prevIndex = this.activeItemIndex - 1;

            if (prevIndex < 0) {
                prevIndex++;
            }

            this.setActiveItem(prevIndex);
        }
    }

    resetActiveItem() {
        this.activeItem = null;
        this.activeItemIndex = -1;
    }

    getScrollTop(): number {
        return this.panel ? this.panel.nativeElement.scrollTop : 0;
    }

    setScrollTop(scrollTop: number) {
        if (this.panel) {
            this.panel.nativeElement.scrollTop = scrollTop;
        }
    }

    selectItem(item: OptionItem) {
        this._itemSelections.next(item);
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
}
