import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NoteStoreService } from '../note-store.service';
import { Subscription } from 'rxjs/Subscription';


@Component({
    selector: 'app-note-editor',
    templateUrl: './note-editor.component.html',
    styleUrls: ['./note-editor.component.less']
})
export class NoteEditorComponent implements OnInit {
    private noteBodyStreamSubscription: Subscription;
    initContent: string;

    constructor(private noteStore: NoteStoreService,
                private changeDetectionRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.noteBodyStreamSubscription = this.noteStore.noteBody.subscribe((noteBody) => {
            if (noteBody) {
                this.initContent = noteBody.content;
            }

            this.changeDetectionRef.detectChanges();
        });
    }
}
