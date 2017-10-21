import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NoteItem } from '../note-store.service';


@Component({
    selector: 'app-note-item',
    templateUrl: './note-item.component.html',
    styleUrls: ['./note-item.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteItemComponent {
    @Input() note: NoteItem;
    @Input() selected = false;
    @Output() select = new EventEmitter<NoteItem>();

    onSelect() {
        this.select.emit(this.note);
    }
}
