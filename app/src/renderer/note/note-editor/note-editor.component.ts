import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NoteEditorService } from './note-editor.service';


@Component({
    selector: 'app-note-editor',
    templateUrl: './note-editor.component.html',
    styleUrls: ['./note-editor.component.less']
})
export class NoteEditorComponent implements OnInit {
    constructor(private noteEditorService: NoteEditorService,
                private elementRef: ElementRef,
                private renderer: Renderer2) {
    }

    ngOnInit() {
        const containerElem = this.elementRef.nativeElement.querySelector('.NoteEditor__container');

        this.noteEditorService.init(containerElem, {
            renderer: this.renderer
        });
    }
}
