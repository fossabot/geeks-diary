import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { ClassName } from '../../../common/utils/class-name';


@Component({
    selector: 'app-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.less']
})
export class IconComponent implements OnInit, OnChanges {
    @Input() name: string;
    @Input() size = 'regular';
    @Input() color = 'black';
    iconClassName = '';
    cn = new ClassName('Icon');

    private parseClassName() {
        this.iconClassName = `la la-${this.name}`;

        this.cn.setModifier('size', this.size);
        this.cn.setModifier('color', this.color);
    }

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.parseClassName();
    }
}
