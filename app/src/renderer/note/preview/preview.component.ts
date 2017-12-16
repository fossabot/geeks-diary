import { Component, Input } from '@angular/core';
import { NoteBody } from '../models';


@Component({
    selector: 'note-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.less']
})
export class NotePreviewComponent {
    @Input() noteBody: NoteBody;
}
