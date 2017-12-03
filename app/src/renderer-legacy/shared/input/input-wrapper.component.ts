import { Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import { ClassName } from '../../../common/utils/class-name';


@Component({
    selector: 'app-input-wrapper',
    templateUrl: './input-wrapper.component.html',
    styleUrls: ['./input-wrapper.component.less']
})
export class InputWrapperComponent implements OnInit, OnChanges {
    @Input() size = 'regular';
    cn = new ClassName('InputWrapper');

    constructor(public _elementRef: ElementRef) {
    }

    ngOnInit() {
        this.cn.setModifier('size', this.size);
    }

    ngOnChanges() {
        this.cn.setModifier('size', this.size);
    }
}
