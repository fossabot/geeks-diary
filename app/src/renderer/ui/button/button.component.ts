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
    @Input() buttonTabIndex = 0;
    @Output() buttonClick = new EventEmitter();
    cn = new ClassName('Button');

    private parseClassName() {
        this.cn.setModifier('type', this.type);
        this.cn.setModifier('size', this.size);

        if (this.loading) {
            this.cn.setModifier('loading', 'enable');
        }

        if (this.active) {
            this.cn.setModifier('active', 'enable');
        } else {
            this.cn.removeModifier('active');
        }
    }

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges(changesObj) {
        this.parseClassName();
    }

    click() {
        this.buttonClick.emit();
    }
}
