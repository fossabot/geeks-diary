import { Component, OnInit } from '@angular/core';

import { ClassName } from '../../common/utils/class-name';


@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.less']
})
export class RootComponent implements OnInit {
    sidebarOpened = false;
    cn = new ClassName('Root');

    private parseClassName() {
        this.cn.setModifier('sidebar', this.sidebarOpened ? 'opened' : 'closed');
    }

    ngOnInit() {
        this.parseClassName();
    }

    toggleSidebar(isOpened: boolean) {
        this.sidebarOpened = isOpened;
        this.parseClassName();
    }
}
