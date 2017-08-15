import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ToolbarItem } from '../../ui/toolbar/toolbar.component';
import { ClassName } from '../../../common/utils/class-name';


@Component({
    selector: 'app-activity-view',
    templateUrl: './activity-view.component.html',
    styleUrls: ['./activity-view.component.less']
})
export class ActivityViewComponent implements OnInit {
    @Output() sidebarToggle = new EventEmitter<boolean>();
    items: ToolbarItem[] = [
        { id: 'ActivityView.noteBrowser', title: 'Note browser', iconName: 'folder' },
        { id: 'ActivityView.scm', title: 'SCM', iconName: 'git-square' }
    ];
    globalActions: ToolbarItem[] = [
        { id: 'GlobalAction.setting', title: 'Setting', iconName: 'cog' }
    ];
    sidebarOpened = false;
    activeItemId: string | null;
    cn = new ClassName('ActivityView');

    private parseClassName() {
        this.cn.setModifier('sidebar', this.sidebarOpened ? 'opened' : 'closed');
    }

    ngOnInit() {
        this.parseClassName();
    }

    isItemActive(item: ToolbarItem) {
        if (this.items === null) {
            return false;
        }

        return this.activeItemId === item.id;
    }

    clickItem(item: ToolbarItem) {
        if (this.isItemActive(item)) {
            this.activeItemId = null;
            this.sidebarOpened = false;
        } else {
            this.activeItemId = item.id;
            this.sidebarOpened = true;
        }

        this.sidebarToggle.emit(this.sidebarOpened);
        this.parseClassName();
    }
}
