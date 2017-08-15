import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { ClassName } from '../../../common/utils/class-name';


@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.less']
})
export class ButtonComponent implements OnInit, OnChanges {
    @Input() buttonType = 'normal';
    @Input() buttonSize = 'regular';
    @Input() buttonTitle = '';
    @Input() loading = false;
    @Input() disabled = false;
    @Input() active = false;
    @Output() buttonClick = new EventEmitter();
    cn = new ClassName('Button');

    private parseClassName() {
        this.cn.setModifier('type', this.buttonType);
        this.cn.setModifier('size', this.buttonSize);

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
