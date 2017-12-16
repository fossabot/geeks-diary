import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NoteStoreService } from '../store.service';
import { NoteBody } from '../models';
import { Subscription } from 'rxjs/Subscription';


@Component({
    selector: 'note-workspace',
    templateUrl: './workspace.component.html',
    styleUrls: ['./workspace.component.less']
})
export class NoteWorkspaceComponent implements OnInit, OnDestroy {
    noteBody: NoteBody;

    private noteBodySubscription: Subscription;

    constructor(private storeService: NoteStoreService,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.noteBodySubscription = this.storeService.noteBody.subscribe((noteBody) => {
            this.noteBody = noteBody;
            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy(): void {
        if (this.noteBodySubscription) {
            this.noteBodySubscription.unsubscribe();
        }
    }
}
