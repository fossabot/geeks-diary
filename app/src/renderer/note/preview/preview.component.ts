import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NoteBody } from '../models';


@Component({
    selector: 'note-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.less']
})
export class NotePreviewComponent implements OnChanges {
    @Input() noteBody: NoteBody;

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
    }
}
