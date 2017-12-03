import { Component, OnDestroy, OnInit } from '@angular/core';

import { ClassName } from '../../common/utils/class-name';
import { NoteStoreService } from '../note/note-store.service';


@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.less']
})
export class RootComponent implements OnInit, OnDestroy {
    sidebarOpened = false;
    cn = new ClassName('Root');

    constructor(private noteStore: NoteStoreService) {
    }

    ngOnInit() {
        this.parseClassName();
    }

    ngOnDestroy() {
        this.noteStore.destroy();
    }

    toggleSidebar(isOpened: boolean) {
        this.sidebarOpened = isOpened;
        this.parseClassName();
    }

    private parseClassName() {
        this.cn.setModifier('sidebar', this.sidebarOpened ? 'opened' : 'closed');
    }
}
