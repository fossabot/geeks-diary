import { Component } from '@angular/core';
import { ToolbarItem } from '../../ui/toolbar/toolbar.component';


@Component({
    selector: 'note-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']
})
export class NoteHeaderComponent {
    noteActionTools: ToolbarItem[] = [
        { id: 'note.header.editorViewChange', title: 'Editor view', iconName: 'eye' },
        { id: 'note.header.delete', title: 'Delete note', iconName: 'trash' }
    ];
}
