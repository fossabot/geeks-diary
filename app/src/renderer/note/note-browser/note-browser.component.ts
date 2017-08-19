import { Component } from '@angular/core';

import { ToolbarItem } from '../../ui/toolbar/toolbar.component';


@Component({
    selector: 'app-note-browser',
    templateUrl: './note-browser.component.html',
    styleUrls: ['./note-browser.component.less']
})
export class NoteBrowserComponent {
    actions: ToolbarItem[] = [
        { id: 'NoteBrowser.createNote', title: 'Create new note', iconName: 'plus' }
    ];
}
