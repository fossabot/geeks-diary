import {
    Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy,
    OnInit, Output, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NoteBodyValueChanges, NoteEditorService } from './editor.service';
import { ToolbarItem } from '../../ui/toolbar/toolbar.component';
import { NoteBody, NoteBodySnippet } from '../models';


@Component({
    selector: 'note-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class NoteEditorComponent implements OnInit, OnChanges, OnDestroy {
    textEditTools: ToolbarItem[] = [
        { id: 'note.textEditorSnippet.tools.header', title: 'Header', iconName: 'header' },
        { id: 'note.textEditorSnippet.tools.bold', title: 'Bold', iconName: 'bold' },
        { id: 'note.textEditorSnippet.tools.italic', title: 'Italic', iconName: 'italic' },
        { id: 'note.textEditorSnippet.tools.bold', title: 'Underline', iconName: 'underline' },
        { id: 'note.textEditorSnippet.tools.listUl', title: 'List ul', iconName: 'list-ul' },
        { id: 'note.textEditorSnippet.tools.listOl', title: 'List ol', iconName: 'list-ol' },
    ];
    @Input() noteBody: NoteBody;
    @Output() noteBodySnippetCreations = new EventEmitter<NoteBodySnippet>();
    @Output() bodyValueChanges = new EventEmitter<NoteBodyValueChanges>();
    @ViewChild('snippetContainer') snippetContainer: ElementRef;

    private noteBodyFromOutsideStreamSubscription: Subscription;
    private valueChangesSubscription: Subscription;

    constructor(private editorService: NoteEditorService,
                private renderer: Renderer2) {
    }

    ngOnInit(): void {
        this.editorService.init(this.snippetContainer.nativeElement, {
            renderer: this.renderer
        });

        this.valueChangesSubscription = this.editorService.valueChanges.subscribe((changes) => {
            this.bodyValueChanges.emit(changes);
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);

        if (this.editorService.initialized && changes.noteBody) {
            this.editorService.parseNoteBody(this.noteBody);
        }
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
