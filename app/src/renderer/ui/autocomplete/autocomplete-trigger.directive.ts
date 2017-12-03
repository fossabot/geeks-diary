import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AutocompleteComponent, OptionItem } from './autocomplete.component';
import { Subscription } from 'rxjs/Subscription';
import { DOWN_ARROW, ENTER, ESCAPE, TAB, UP_ARROW } from '../../../common/key-codes';


export const UI_AUTOCOMPLETE_TRIGGER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AutocompleteTriggerDirective),
    multi: true
};


@Directive({
    selector: 'input[uiAutocomplete]',
    providers: [UI_AUTOCOMPLETE_TRIGGER_VALUE_ACCESSOR]
})
export class AutocompleteTriggerDirective implements ControlValueAccessor {
    @Input('uiAutocomplete') uiAutocomplete: AutocompleteComponent;

    private closingActionsSubscription: Subscription;
    private _panelOpen = false;
    _onChange: (value: any) => void = () => {};
    _onTouched = () => {};

    constructor(private elementRef: ElementRef) {
    }

    get panelOpen(): boolean {
        return this._panelOpen && this.uiAutocomplete.showPanel;
    }

    get activeItem(): OptionItem {
        if (this.uiAutocomplete) {
            return this.uiAutocomplete.activeItem;
        }

        return null;
    }

    openPanel() {
        this.uiAutocomplete.setVisibility();
        this._panelOpen = true;
        this.uiAutocomplete._isOpen = true;

        this.closingActionsSubscription = this.uiAutocomplete.itemSelections.subscribe((option) => {
            this.elementRef.nativeElement.value = option.value;
            this._onChange(option.value);
            this.elementRef.nativeElement.focus();
            this.closePanel();
        });
    }

    closePanel() {
        this.uiAutocomplete.resetActiveItem();
        this.uiAutocomplete.setVisibility();

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
    handleKeydown(event: KeyboardEvent) {
        const keyCode = event.keyCode;

        if (keyCode === ESCAPE && this.panelOpen) {
            this.uiAutocomplete.resetActiveItem();
            this.closePanel();
            event.stopPropagation();
        } else if (keyCode === ENTER && this.activeItem && this.panelOpen) {
            this.uiAutocomplete.selectItem(this.activeItem);
            this.uiAutocomplete.resetActiveItem();
            event.preventDefault();
        } else {
            const prevActiveItem = this.uiAutocomplete.activeItem;
            const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW;

            if (this.panelOpen || keyCode === TAB) {
                this.uiAutocomplete.onKeydown(event);
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
            this._onChange((<HTMLInputElement>event.target).value);
            this.openPanel();
        }
    }

    @HostListener('blur')
    onBlur() {
        this._onTouched();
    }
}
