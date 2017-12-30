import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NoteStoreService } from '../store.service';
import { NoteBody, NoteBodySnippet, NoteItem } from '../models';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { NoteBodyValueChanges } from '../editor/editor.service';


@Component({
    selector: 'note-workspace',
    templateUrl: './workspace.component.html',
    styleUrls: ['./workspace.component.less']
})
export class NoteWorkspaceComponent implements OnInit, OnDestroy {
    selectedNoteItem: NoteItem;
    noteBody: NoteBody;

    private noteBodySaveSource = new Subject<NoteBody>();
    private noteItemSelectionSubscription: Subscription;
    private noteBodySubscription: Subscription;

    constructor(private storeService: NoteStoreService,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.noteItemSelectionSubscription = this.storeService.noteItemSelection.subscribe((noteItem) => {
            this.selectedNoteItem = noteItem;
            this.changeDetectorRef.detectChanges();
        });

        this.noteBodySubscription = this.storeService.noteBody.subscribe((noteBody) => {
            this.noteBody = noteBody;
            this.changeDetectorRef.detectChanges();
        });

        this.storeService.registerSaveNoteBodySource(this.noteBodySaveSource);
    }

    ngOnDestroy(): void {
        if (this.noteItemSelectionSubscription) {
            this.noteItemSelectionSubscription.unsubscribe();
        }

        if (this.noteBodySubscription) {
            this.noteBodySubscription.unsubscribe();
        }
    }

    createNewNoteBodySnippet(newSnippet: NoteBodySnippet, refIndex?: number): void {
    }

    changeNoteBodySnippetValue(changes: NoteBodyValueChanges): void {
        this.noteBody.updateValue(changes.value, changes.index);
        this.noteBodySaveSource.next(this.noteBody);
    }

}
