import { Component, OnInit } from '@angular/core';

import { ActivityView, ActivityViewItem } from './activity-view';
import { ToolbarItem } from '../../ui/toolbar/toolbar.component';


@Component({
    selector: 'app-activity-view',
    templateUrl: './activity-view.component.html',
    styleUrls: ['./activity-view.component.less']
})
export class ActivityViewComponent implements OnInit {
    viewItems: ActivityViewItem[];
    globalActions: ToolbarItem[] = [
        { title: 'Setting', iconName: 'cog' }
    ];

    private toggleSidebar(item: ActivityViewItem) {
    }

    private closeSidebar() {
    }

    constructor(private activityView: ActivityView) {
    }

    ngOnInit() {
        this.viewItems = this.activityView.items;

        this.activityView.actives$.subscribe((item) => {
            console.log(item);
            this.toggleSidebar(item);
        });

        this.activityView.disables$.subscribe(() => {
            console.log('disables');
            this.closeSidebar();
        });
    }

    getActiveItem(): ActivityViewItem | null {
        return this.activityView.activeItem;
    }

    clickViewItem(item: ActivityViewItem) {
        this.activityView.toggle(item);
    }
}
