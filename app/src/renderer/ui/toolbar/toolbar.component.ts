import { Component, EventEmitter, OnInit, OnChanges, Input, Output } from '@angular/core';

import { ClassName } from '../../../common/utils/class-name';


export interface ToolbarItem {
    title: string;
    iconName: string;
    metadata?: any;
}


@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.less']
})
export class ToolbarComponent implements OnInit, OnChanges {
    @Input() toolbarTitle = '';
    @Input() toolbarSize = 'regular';
    @Input() toolbarDirection = 'horizontal';
    @Input() toolbarItems: ToolbarItem[] = [];
    @Output() toolBarClick: EventEmitter<ToolbarItem> = new EventEmitter();
    cn = new ClassName('Toolbar');

    private parseClassName() {
        this.cn.setModifier('size', this.toolbarSize);
        this.cn.setModifier('direction', this.toolbarDirection);
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.parseClassName();
    }

    clickToolbarItem(toolbarItem: ToolbarItem) {
        this.toolBarClick.emit(toolbarItem);
    }
}
