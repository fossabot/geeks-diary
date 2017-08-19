import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { UIModule } from '../ui/ui.module';

import { NoteCalendarComponent } from './note-calendar/note-calendar.component';
import { NoteCalendarDateCellComponent } from './note-calendar-date-cell/note-calendar-date-cell.component';
import { NoteBrowserComponent } from './note-browser/note-browser.component';
import { NoteItemComponent } from './note-item/note-item.component';


@NgModule({
    imports: [
        SharedModule,
        UIModule
    ],
    declarations: [
        NoteCalendarComponent,
        NoteCalendarDateCellComponent,
        NoteBrowserComponent,
        NoteItemComponent
    ],
    providers: [],
    exports: [
        NoteBrowserComponent
    ]
})
export class NoteModule {
}
