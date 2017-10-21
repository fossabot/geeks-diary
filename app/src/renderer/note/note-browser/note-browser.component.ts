import { Component, OnDestroy, OnInit } from '@angular/core';

import { ToolbarItem } from '../../ui/toolbar/toolbar.component';
import { Observable } from 'rxjs/Observable';
import { NoteItem, NoteStoreService } from '../note-store.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';


@Component({
    selector: 'app-note-browser',
    templateUrl: './note-browser.component.html',
    styleUrls: ['./note-browser.component.less']
})
export class NoteBrowserComponent implements OnInit, OnDestroy {
    actions: ToolbarItem[] = [
        { id: 'NoteBrowser.createNote', title: 'Create new note', iconName: 'plus' }
    ];
    noteItems: Observable<NoteItem[]>;
    noteItemSelectionStream = new Subject<NoteItem>();
    private selectNoteItemSubscription: Subscription;

    constructor(private noteStore: NoteStoreService) {
    }

    ngOnInit() {
        this.noteItems = this.noteStore.noteItems;

        this.selectNoteItemSubscription =
            this.noteStore.registerSelectNoteItemSource(this.noteItemSelectionStream);
    }

    ngOnDestroy() {
        if (this.selectNoteItemSubscription) {
            this.selectNoteItemSubscription.unsubscribe();
        }
    }

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
