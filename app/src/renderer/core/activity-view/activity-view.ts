import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ToolbarItem } from '../../ui/toolbar/toolbar.component';


export interface ActivityViewItem extends ToolbarItem {
    id: string;
}

@Injectable()
export class ActivityView {
    actives$ = new Subject<ActivityViewItem>();
    disables$ = new Subject<void>();

    items: ActivityViewItem[] = [
        {
            id: 'ActivityView.noteBrowser',
            title: 'Note Browser',
            iconName: 'folder'
        }
    ];
    activeItem: ActivityViewItem | null = null;
    sidebarOpened = false;

    isItemActive(item: ActivityViewItem): boolean {
        if (this.activeItem === null) {
            return false;
        }

        return this.activeItem.id === item.id;
    }

    toggle(item: ActivityViewItem) {
        if (this.isItemActive(item)) {
            this.activeItem = null;
            this.sidebarOpened = false;

            this.disables$.next();
        } else {
            this.activeItem = item;
            this.sidebarOpened = true;

            this.actives$.next(item);
        }
    }
}
