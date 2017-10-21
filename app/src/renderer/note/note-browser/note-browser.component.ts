import { Component, OnInit } from '@angular/core';

import { ToolbarItem } from '../../ui/toolbar/toolbar.component';
import { Observable } from 'rxjs/Observable';
import { NoteItem, NoteStoreService } from '../note-store.service';
import { Subject } from 'rxjs/Subject';


@Component({
    selector: 'app-note-browser',
    templateUrl: './note-browser.component.html',
    styleUrls: ['./note-browser.component.less']
})
export class NoteBrowserComponent implements OnInit {
    actions: ToolbarItem[] = [
        { id: 'NoteBrowser.createNote', title: 'Create new note', iconName: 'plus' }
    ];
    noteItems: Observable<NoteItem[]>;
    noteItemSelectionStream = new Subject<NoteItem>();

    constructor(private noteStore: NoteStoreService) {
        this.noteStore.registerReadNoteBodySource(this.noteItemSelectionStream);
        this.noteStore.registerSelectNoteItemSource(this.noteItemSelectionStream);
    }

    // Component life cycle

    ngOnInit() {
        this.noteItems = this.noteStore.noteItems;
    }

    // Component view model

    get noteItemSelection(): Observable<NoteItem> {
        return this.noteStore.noteItemSelection;
    }

    isNoteItemSelected(selection: NoteItem, noteItem: NoteItem): boolean {
        if (!selection) {
            return false;
        }

        return selection.id === noteItem.id;
    }

    selectNoteItem(noteItem: NoteItem) {
        this.noteItemSelectionStream.next(noteItem);
    }
}
