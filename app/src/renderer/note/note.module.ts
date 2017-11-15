import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { UIModule } from '../ui/ui.module';

import { NoteCalendarComponent } from './note-calendar/note-calendar.component';
import { NoteCalendarDateCellComponent } from './note-calendar-date-cell/note-calendar-date-cell.component';
import { NoteBrowserComponent } from './note-browser/note-browser.component';
import { NoteItemComponent } from './note-item/note-item.component';
import { NoteHeaderComponent } from './note-header/note-header.component';
import { NoteStoreService } from './note-store.service';
import { NoteEditorComponent } from './note-editor/note-editor.component';
import { NotePrettierService } from './note-preview/note-prettier.service';
import { NotePreviewComponent } from './note-preview/note-preview.component';
import { NoteWorkspaceComponent } from './note-workspace/note-workspace.component';
import { NoteEditorService } from './note-editor/note-editor.service';
import { NoteCodeEditorSnippetCreateModalComponent } from './note-editor/code-snippet-create-modal.component';


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
        NoteHeaderComponent,
        NoteEditorComponent,
        NoteWorkspaceComponent,
        NotePreviewComponent,
        NoteCodeEditorSnippetCreateModalComponent
    ],
    entryComponents: [
        NoteCodeEditorSnippetCreateModalComponent
    ],
    providers: [
        NoteStoreService,
        NotePrettierService,
        NoteEditorService
    ],
    exports: [
        NoteBrowserComponent,
        NoteWorkspaceComponent
    ]
})
export class NoteModule {
}
