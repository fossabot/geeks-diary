import { Directive, ElementRef, forwardRef, HostBinding, HostListener, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { Subject } from 'rxjs/Subject';

import { UIAutocompleteComponent } from './autocomplete.component';
import { DOWN_ARROW, ENTER, ESCAPE, TAB, UP_ARROW } from '../../../common/key-codes';
import { UIOptionComponent, UIOptionSelectionChange } from '../option/option.component';


export const UI_AUTOCOMPLETE_TRIGGER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UIAutocompleteTriggerDirective),
    multi: true
};


@Directive({
    selector: 'input[uiAutocomplete]',
    providers: [UI_AUTOCOMPLETE_TRIGGER_VALUE_ACCESSOR]
})
export class UIAutocompleteTriggerDirective implements ControlValueAccessor, OnDestroy {
    @Input('uiAutocomplete') uiAutocomplete: UIAutocompleteComponent;

    // @HostBinding('role') private role = 'combobox';
    // @HostBinding('autocomplete') private nativeAutocomplete = 'off';
    // @HostBinding('aria-autocomplete') private ariaAutocomplete = 'list';
    // @HostBinding('[attr.aria-expanded]') private ariaExpanded = this.panelOpen.toString();

    private closingActionsSubscription: Subscription;
    private _panelOpen = false;
    private escapeEventStream = new Subject<void>();
    _onChange: (value: any) => void = () => {};
    _onTouched = () => {};

    constructor(private elementRef: ElementRef) {
    }

    get panelOpen(): boolean {
        return this._panelOpen && this.uiAutocomplete.showPanel;
    }

    get activeItem(): UIOptionComponent {
        if (this.uiAutocomplete) {
            return this.uiAutocomplete.activeItem;
        }

        return null;
    }

    get panelClosingActions(): Observable<UIOptionSelectionChange | void> {
        return merge(
            this.optionSelections,
            this.uiAutocomplete.tabOut
        );
    }

    get optionSelections(): Observable<UIOptionSelectionChange> {
        return merge(...this.uiAutocomplete.items.map(item => item.selectionChanges));
    }

    ngOnDestroy() {
        this.closePanel();
        this.escapeEventStream.complete();
    }

    openPanel() {
        this.uiAutocomplete.setVisibility();
        this._panelOpen = true;
        this.uiAutocomplete._isOpen = true;

        this.closingActionsSubscription = this.panelClosingActions.subscribe((event) => {
            this.uiAutocomplete.resetActiveItem();
            this.uiAutocomplete.setVisibility();

            if (event && event.source) {
                this.uiAutocomplete.clearSelectedItem(event.source);
                this.elementRef.nativeElement.value = event.source.value;
                this._onChange(event.source.value);
                this.elementRef.nativeElement.focus();
            }

            this.closePanel();
        });
    }

    closePanel() {
        if (this.closingActionsSubscription) {
            this.closingActionsSubscription.unsubscribe();
        }

        if (this._panelOpen) {
            this.uiAutocomplete._isOpen = false;
            this._panelOpen = false;
        }
    }

    writeValue(value: any) {
        Promise.resolve(null).then(() => {
            this.elementRef.nativeElement.value = value;
        });
    }

    registerOnChange(fn: (value: any) => {}) {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => {}) {
        this._onTouched = fn;
    }

    @HostListener('keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        const keyCode = event.keyCode;

        if (keyCode === ESCAPE && this.panelOpen) {
            this.uiAutocomplete.resetActiveItem();
            this.escapeEventStream.next();
            event.stopPropagation();
        } else if (keyCode === ENTER && this.activeItem && this.panelOpen) {
            this.activeItem.select();
            this.uiAutocomplete.resetActiveItem();
            event.preventDefault();
        } else {
            const prevActiveItem = this.uiAutocomplete.activeItem;
            const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW;

            if (this.panelOpen || keyCode === TAB) {
                this.uiAutocomplete.onKeyDown(event);
            } else if (isArrowKey) {
                this.openPanel();
            }

            if (isArrowKey || this.uiAutocomplete.activeItem !== prevActiveItem) {
                this.uiAutocomplete.scrollToActiveItem();
            }
        }
    }

    @HostListener('input', ['$event'])
    handleInput(event: KeyboardEvent) {
        if (document.activeElement === event.target) {
            console.log('oh1');
            this._onChange((event.target as HTMLInputElement).value);
            this.openPanel();
        }
    }

    @HostListener('blur')
    onBlur() {
        this._onTouched();
    }
}
