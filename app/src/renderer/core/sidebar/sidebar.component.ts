import { Component, EventEmitter, Injector, Input, OnInit, Output, Type } from '@angular/core';
import { ToolbarItem } from '../../ui/toolbar/toolbar.component';


export interface SidebarContentOutlet {
    toolbarItem: ToolbarItem;
    component: Type<any>;
    injector?: Injector;
    content?: any[][];
}


@Component({
    selector: 'core-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {
    @Input() outlets: SidebarContentOutlet[] = [];
    @Output() toggle = new EventEmitter<boolean>();
    activeItemId: string = null;
    showPanel = false;

    get toolbarItems(): ToolbarItem[] {
        return this.outlets.map(o => o.toolbarItem);
    }

    ngOnInit() {}

    isItemActive(item: ToolbarItem): boolean {
        return this.activeItemId === item.id;
    }

    isPanelActive(outlet: SidebarContentOutlet): boolean {
        return outlet.toolbarItem.id === this.activeItemId;
    }

    togglePanel(item: ToolbarItem) {
        if (this.isItemActive(item)) {
            this.activeItemId = null;
            this.showPanel = false;
        } else {
            this.activeItemId = item.id;
            this.showPanel = true;
        }

        this.toggle.emit(this.showPanel);
    }
}
