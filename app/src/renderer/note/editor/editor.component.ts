import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NoteEditorService } from './editor.service';


@Component({
    selector: 'note-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.less']
})
export class NoteEditorComponent implements OnInit {
    @ViewChild('snippetContainer') snippetContainer: ElementRef;

    constructor(private editorService: NoteEditorService,
                private renderer: Renderer2) {
    }

    ngOnInit() {
        this.editorService.init(this.snippetContainer.nativeElement, {
            renderer: this.renderer
        });
    }
}
