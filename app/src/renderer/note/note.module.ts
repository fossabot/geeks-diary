import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { UIModule } from '../ui/ui.module';

import { NoteCalendarComponent } from './note-calendar/note-calendar.component';
import { NoteBrowserComponent } from './note-browser/note-browser.component';


@NgModule({
    imports: [
        SharedModule,
        UIModule
    ],
    declarations: [
        NoteCalendarComponent,
        NoteBrowserComponent
    ],
    providers: [],
    exports: [
        NoteBrowserComponent
    ]
})
export class NoteModule {
}
