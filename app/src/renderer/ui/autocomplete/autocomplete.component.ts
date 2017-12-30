import {
    AfterContentInit, Component, ContentChildren, ElementRef, OnDestroy, QueryList, Renderer2,
    ViewChild
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DOWN_ARROW, TAB, UP_ARROW } from '../../../common/key-codes';
import { Observable } from 'rxjs/Observable';
import { OptionItemDirective } from './option-item.directive';
import { Subscription } from 'rxjs/Subscription';


@Component({
    selector: 'ui-autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.less'],
    exportAs: 'uiAutocomplete'
})
export class AutocompleteComponent implements OnDestroy {
    @ViewChild('panel') panel: ElementRef;
    @ContentChildren(OptionItemDirective) options: QueryList<OptionItemDirective>;

    activeItemIndex = -1;
    activeItem: OptionItemDirective = null;
    tabOut = new Subject<void>();
    showPanel = false;
    _isOpen = false;

    private _itemSelections = new Subject<OptionItemDirective>();

    get isOpen(): boolean {
        return this._isOpen && this.showPanel;
    }

    get itemSelections(): Observable<OptionItemDirective> {
        return this._itemSelections.asObservable();
    }

    constructor(private elementRef: ElementRef,
                private renderer: Renderer2) {
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

    setVisibility(triggerElem?: ElementRef) {
        this.showPanel = !!this.options.length;

        if (this.showPanel && triggerElem) {
            const position = triggerElem.nativeElement.getBoundingClientRect();

            this.renderer.setStyle(this.elementRef.nativeElement, 'left', `${position.left}px`);
            this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${position.bottom}px`);
        }
    }

    setActiveItem(index: number) {
        if (this.activeItem) {
            this.activeItem._isActivated = false;
            this.activeItem = null;
        }

        this.activeItemIndex = index;
        this.activeItem = this.options.find((i, idx) => idx === index);

        if (this.activeItem) {
            this.activeItem._isActivated = true;
        }
    }

    setNextItemActive() {
        if (this.activeItemIndex < 0) {
            this.setActiveItem(0);
        } else {
            const nextIndex = this.activeItemIndex + 1;

            if (nextIndex < this.options.length) {
                this.setActiveItem(nextIndex);
            }
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

    selectOption(option: OptionItemDirective) {
        this._itemSelections.next(option);
    }

    scrollToActiveItem() {
        const activeOptionIndex = this.activeItemIndex || 0;
        const optionOffset = activeOptionIndex * 37;
        const panelTop = this.getScrollTop();

        if (optionOffset < panelTop) {
            // Scroll up to reveal selected option scrolled above the panel top
            this.setScrollTop(optionOffset);
        } else if (optionOffset + 37 > panelTop + 300) {
            // Scroll down to reveal selected option scrolled below the panel bottom
            const newScrollTop = optionOffset - 300 + 37;
            this.setScrollTop(Math.max(0, newScrollTop));
        }
    }
}
