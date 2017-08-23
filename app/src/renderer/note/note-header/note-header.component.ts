import { Component } from '@angular/core';

import { ToolbarItem } from '../../ui/toolbar/toolbar.component';


@Component({
    selector: 'app-note-header',
    templateUrl: './note-header.component.html',
    styleUrls: ['./note-header.component.less']
})
export class NoteHeaderComponent {
    noteActions: ToolbarItem[] = [
        { id: 'NoteAction.changeEditorView', title: 'Change editor view', iconName: 'eye' },
        { id: 'NoteAction.deleteNote', title: 'Delete note', iconName: 'trash' },
        { id: 'NoteAction.exportNote', title: 'Export note', iconName: 'external-link' }
    ]
}
