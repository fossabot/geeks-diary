import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';


export interface OptionItem {
    id?: any;
    name: string;
    value: any;
    inputValue: string;
}


@Directive({
    selector: '[uiOptionItem]'
})
export class OptionItemDirective {
    @HostBinding('class.activated') _isActivated = false;
    @Input() item: OptionItem;
    @Output() _selectViaClick = new EventEmitter<any>();

    @HostListener('click')
    private handleClick(): void {
        this._selectViaClick.next(this.item);
    }
}
