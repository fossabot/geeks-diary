import { Component, EventEmitter, Input, Output } from '@angular/core';


export interface UIOptionSelectionChange {
    source: UIOptionComponent;
}


@Component({
    selector: 'ui-option',
    templateUrl: './option.component.html',
    styleUrls: ['./option.component.less']
})
export class UIOptionComponent {
    @Input()
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = value;
    }

    @Input() size = 'regular';
    @Input() value: any;
    @Output() selectionChanges = new EventEmitter<UIOptionSelectionChange>();

    private _selected = false;
    private _active = false;
    private _disabled = false;

    get active(): boolean {
        return this._active;
    }

    get selected(): boolean {
        return this._selected;
    }

    activate() {
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    select() {
        if (!this.disabled) {
            this._selected = true;
            this.selectionChanges.next({ source: this });
        }
    }

    deselect() {
        this._selected = false;
    }
}
