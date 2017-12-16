import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NoteItem } from '../models';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { NoteStoreService } from '../store.service';


@Component({
    selector: 'note-finder',
    templateUrl: './finder.component.html',
    styleUrls: ['./finder.component.less']
})
export class NoteFinderComponent implements OnInit, OnDestroy {
    noteItems: Observable<NoteItem[]>;
    noteItemSelection: Observable<NoteItem>;
    noteItemSelectStream = new Subject<NoteItem>();
    private selectNoteItemSubscription: Subscription;

    constructor(private storeService: NoteStoreService) {
    }

    ngOnInit(): void {
        this.noteItems = this.storeService.noteItems;
        this.noteItemSelection = this.storeService.noteItemSelection;

        this.selectNoteItemSubscription =
            this.storeService.registerSelectNoteItemSource(
                this.noteItemSelectStream);
    }

    ngOnDestroy(): void {
        if (this.selectNoteItemSubscription) {
            this.selectNoteItemSubscription.unsubscribe();
        }
    }

    isNoteItemSelected(selection: NoteItem, target: NoteItem): boolean {
        if (!selection) {
            return false;
        }

        return selection.id === target.id;
    }

    selectNoteItem(noteItem: NoteItem): void {
        this.noteItemSelectStream.next(noteItem);
    }
}
