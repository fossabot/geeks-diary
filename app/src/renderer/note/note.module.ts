import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { UIModule } from '../ui/ui.module';

import { NoteCalendarComponent } from './note-calendar/note-calendar.component';
import { NoteCalendarDateCellComponent } from './note-calendar-date-cell/note-calendar-date-cell.component';
import { NoteBrowserComponent } from './note-browser/note-browser.component';
import { NoteItemComponent } from './note-item/note-item.component';
import { NoteHeaderComponent } from './note-header/note-header.component';


@NgModule({
    imports: [
        SharedModule,
        UIModule
    ],
    declarations: [
        NoteCalendarComponent,
        NoteCalendarDateCellComponent,
        NoteBrowserComponent,
        NoteItemComponent,
        NoteHeaderComponent
    ],
    providers: [],
    exports: [
        NoteBrowserComponent,
        NoteHeaderComponent
    ]
})
export class NoteModule {
}
