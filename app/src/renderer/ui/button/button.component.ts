import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ClassName } from '../../../common/utils/class-name';


@Component({
    selector: 'ui-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.less']
})
export class ButtonComponent implements OnInit, OnChanges {
    @Input() type = 'normal';
    @Input() size = 'regular';
    @Input() title = '';
    @Input() loading = false;
    @Input() disabled = false;
    @Input() active = false;
    @Input() buttonType = 'button';
    @Input() tabIndex = 0;
    @Output() buttonClick = new EventEmitter<Event>();
    className = new ClassName('Button');

    constructor() {
    }

    ngOnInit() {
        this.parseClassName();
    }

    ngOnChanges() {
        this.parseClassName();
    }

    click(event: Event) {
        this.buttonClick.emit(event);
    }

    private parseClassName() {
        this.className.setModifier('size', this.size);
        this.className.setModifier('type', this.type);
        this.className.setModifier('active', this.active ? 'enabled' : 'disabled');
    }
}
