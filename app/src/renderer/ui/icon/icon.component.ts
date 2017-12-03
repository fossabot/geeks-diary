import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ClassName } from '../../../common/utils/class-name';


@Component({
    selector: 'ui-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.less']
})
export class IconComponent implements OnInit, OnChanges {
    @Input() name: string;
    @Input() size = 'regular';
    @Input() color = 'black';
    iconClassName = '';
    className = new ClassName('Icon');

    constructor() {
    }

    ngOnInit() {
        this.parseClassName();
    }

    ngOnChanges() {
        this.parseClassName();
    }

    private parseClassName() {
        this.iconClassName = `la la-${this.name}`;

        this.className.setModifier('size', this.size);
        this.className.setModifier('color', this.color);
    }
}
