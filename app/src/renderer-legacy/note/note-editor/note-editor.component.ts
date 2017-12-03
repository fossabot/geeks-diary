import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NoteEditorService } from './note-editor.service';
import { ToolbarItem } from '../../ui/toolbar/toolbar.component';


@Component({
    selector: 'app-note-editor',
    templateUrl: './note-editor.component.html',
    styleUrls: ['./note-editor.component.less']
})
export class NoteEditorComponent implements OnInit {
    textEditorSnippetTools: ToolbarItem[] = [
        { id: 'note.textEditorSnippet.tools.bold', title: 'Bold', iconName: 'bold' },
        { id: 'note.textEditorSnippet.tools.italic', title: 'Italic', iconName: 'italic' },
        { id: 'note.textEditorSnippet.tools.bold', title: 'Underline', iconName: 'underline' },
        { id: 'note.textEditorSnippet.tools.listUl', title: 'List ul', iconName: 'list-ul' },
        { id: 'note.textEditorSnippet.tools.listOl', title: 'List ol', iconName: 'list-ol' },
        { id: 'note.textEditorSnippet.tools.header', title: 'Header', iconName: 'header' }
    ];
    @ViewChild('snippetContainer') snippetContainer: ElementRef;

    constructor(private noteEditorService: NoteEditorService,
                private renderer: Renderer2) {
    }

    ngOnInit() {
        this.noteEditorService.init(this.snippetContainer.nativeElement, {
            renderer: this.renderer
        });
    }
}
