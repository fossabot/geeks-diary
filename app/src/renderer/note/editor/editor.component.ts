import {
    Component, ElementRef, EventEmitter, OnDestroy,
    OnInit, Output, Renderer2, ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NoteBodyValueChanges, NoteEditorService } from './editor.service';
import { ToolbarItem } from '../../ui/toolbar/toolbar.component';
import { NoteStoreService } from '../store.service';


@Component({
    selector: 'note-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.less']
})
export class NoteEditorComponent implements OnInit, OnDestroy {
    textEditTools: ToolbarItem[] = [
        { id: 'note.textEditorSnippet.tools.header', title: 'Header', iconName: 'header' },
        { id: 'note.textEditorSnippet.tools.bold', title: 'Bold', iconName: 'bold' },
        { id: 'note.textEditorSnippet.tools.italic', title: 'Italic', iconName: 'italic' },
        { id: 'note.textEditorSnippet.tools.bold', title: 'Underline', iconName: 'underline' },
        { id: 'note.textEditorSnippet.tools.listUl', title: 'List ul', iconName: 'list-ul' },
        { id: 'note.textEditorSnippet.tools.listOl', title: 'List ol', iconName: 'list-ol' },
    ];
    @Output() valueChanges = new EventEmitter<NoteBodyValueChanges>();
    @ViewChild('snippetContainer') snippetContainer: ElementRef;

    private noteBodyFromOutsideStreamSubscription: Subscription;
    private valueChangesSubscription: Subscription;

    constructor(private editorService: NoteEditorService,
                private storeService: NoteStoreService,
                private renderer: Renderer2) {
    }

    ngOnInit(): void {
        this.noteBodyFromOutsideStreamSubscription =
            this.storeService.noteBody.subscribe((noteBody) => {
                this.editorService.parseNoteBody(noteBody);
            });

        this.editorService.init(this.snippetContainer.nativeElement, {
            renderer: this.renderer
        });

        this.valueChangesSubscription = this.editorService.valueChanges.subscribe((changes) => {
            this.valueChanges.emit(changes);
        });
    }

    ngOnDestroy(): void {
        if (this.noteBodyFromOutsideStreamSubscription) {
            this.noteBodyFromOutsideStreamSubscription.unsubscribe();
        }

        if (this.valueChangesSubscription) {
            this.valueChangesSubscription.unsubscribe();
        }
    }
}
