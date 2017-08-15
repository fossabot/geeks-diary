import { Component, EventEmitter, OnInit, OnChanges, Input, Output } from '@angular/core';

import { ClassName } from '../../../common/utils/class-name';


export interface ToolbarItem {
    id?: string;
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
    @Input() activeItem: ToolbarItem | null = null;
    @Output() toolBarClick: EventEmitter<ToolbarItem> = new EventEmitter();
    cn = new ClassName('Toolbar');

    private parseClassName() {
        this.cn.setModifier('size', this.toolbarSize);
        this.cn.setModifier('direction', this.toolbarDirection);
    }

    ngOnInit() {
    }

    ngOnChanges(changesObj) {
        this.parseClassName();
    }

    isItemActive(item: ToolbarItem): boolean {
        if (this.activeItem === null) {
            return false;
        }

        return this.activeItem.id === item.id;
    }

    clickToolbarItem(item: ToolbarItem) {
        this.toolBarClick.emit(item);
    }
}
