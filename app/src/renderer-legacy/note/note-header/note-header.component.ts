import { Component } from '@angular/core';

import { ToolbarItem } from '../../ui/toolbar/toolbar.component';
import { NoteItem, NoteStoreService } from '../note-store.service';
import { Observable } from 'rxjs/Observable';


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
    ];

    constructor(private noteStore: NoteStoreService) {
    }

    get noteItemSelection(): Observable<NoteItem> {
        return this.noteStore.noteItemSelection;
    }
}
