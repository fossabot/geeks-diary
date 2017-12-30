import { Directive, ElementRef, HostBinding, Input, Optional, Self } from '@angular/core';
import { FormGroupDirective, NgControl } from '@angular/forms';


@Directive({
    selector: 'input[uiInput]'
})
export class InputDirective {
    @Input() textAlign = 'left';
    @HostBinding('style.textAlign')
    get textAlignStyle(): string { return this.textAlign; }

    @HostBinding('style.paddingLeft.px')
    get inputPaddingLeft(): number {
        return this._paddingLeft;
    }

    @HostBinding('style.paddingRight.px')
    get inputPaddingRight(): number {
        return this._paddingRight;
    }

    _paddingLeft: number;
    _paddingRight: number;

    constructor(@Self() public ngControl: NgControl,
                @Optional() public parentForm: FormGroupDirective,
                public elementRef: ElementRef) {
        this._paddingLeft = elementRef.nativeElement.style.paddingLeft || 0;
        this._paddingRight = elementRef.nativeElement.style.paddingRight || 0;
    }
}
