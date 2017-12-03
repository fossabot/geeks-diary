import { NgModule } from '@angular/core';
import { UIModule } from '../ui/ui.module';
import { NoteFinderComponent } from './finder/finder.component';
import { NoteCodeEditorSnippetCreateModalComponent } from './editor/code-editor-snippet-create-modal.component';
import { NoteEditorComponent } from './editor/editor.component';
import { NoteWorkspaceComponent } from './workspace/workspace.component';
import { NoteEditorService } from './editor/editor.service';


@NgModule({
    imports: [
        UIModule
    ],
    declarations: [
        NoteFinderComponent,
        NoteEditorComponent,
        NoteCodeEditorSnippetCreateModalComponent,
        NoteWorkspaceComponent
    ],
    entryComponents: [
        NoteFinderComponent,
        NoteCodeEditorSnippetCreateModalComponent
    ],
    providers: [
        NoteEditorService
    ],
    exports: [
        NoteFinderComponent,
        NoteWorkspaceComponent
    ]
})
export class NoteModule {
}
