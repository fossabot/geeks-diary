import { Component, Injector } from '@angular/core';
import { SidebarContentOutlet } from './core/sidebar/sidebar.component';
import { NoteFinderComponent } from './note/finder/finder.component';


@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.less']
})
export class RootComponent {
    sidebarOutlets: SidebarContentOutlet[] = [];
    sidebarPanelOpened = false;

    constructor(private injector: Injector) {
        this.sidebarOutlets = [
            {
                toolbarItem: { id: 'app.root.sidebar.noteFinder', title: 'Note finder', iconName: 'folder' },
                component: NoteFinderComponent,
                injector: this.injector
            }
        ]
    }

    toggleSidebarPanel(opened: boolean) {
        this.sidebarPanelOpened = opened;
    }
}
