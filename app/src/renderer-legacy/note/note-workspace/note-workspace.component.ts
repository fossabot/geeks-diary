import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NoteStoreService } from '../note-store.service';


@Component({
    selector: 'app-note-workspace',
    templateUrl: './note-workspace.component.html',
    styleUrls: ['./note-workspace.component.less']
})
export class NoteWorkspaceComponent implements OnInit, OnDestroy {
    private noteBodySubscription: Subscription;
    initContent: string;

    constructor(private noteStore: NoteStoreService,
                private changeDetectionRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.noteBodySubscription = this.noteStore.noteBody.subscribe((noteBody) => {
            if (noteBody) {
                this.initContent = noteBody.content;
            }

            this.changeDetectionRef.detectChanges();
        });
    }

    ngOnDestroy() {
        if (this.noteBodySubscription) {
            this.noteBodySubscription.unsubscribe();
        }
    }
}
