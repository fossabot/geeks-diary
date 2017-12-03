import { Component, EventEmitter, OnInit, OnChanges, Input, Output } from '@angular/core';
import { ClassName } from '../../../common/utils/class-name';


export interface ToolbarItem {
    id: string;
    title: string;
    iconName: string;
    metadata?: any;
}


@Component({
    selector: 'ui-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.less']
})
export class ToolbarComponent implements OnInit, OnChanges {
    @Input() title = '';
    @Input() size = 'regular';
    @Input() direction = 'horizontal';
    @Input() items: ToolbarItem[] = [];
    @Input() activeItemId: string | number | null = null;
    @Output() toolBarClick: EventEmitter<ToolbarItem> = new EventEmitter();
    className = new ClassName('Toolbar');

    ngOnInit() {
    }

    ngOnChanges(changesObj) {
        this.parseClassName();
    }

    isItemActive(item: ToolbarItem): boolean {
        if (this.activeItemId === null) {
            return false;
        }

        return this.activeItemId === item.id;
    }

    clickToolbarItem(item: ToolbarItem) {
        this.toolBarClick.emit(item);
    }

    private parseClassName() {
        this.className.setModifier('size', this.size);
        this.className.setModifier('direction', this.direction);
    }
}
