import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoteModule } from './note/note.module';
import { RootComponent } from './root.component';
import { CoreModule } from './core/core.module';
import { CodeModule } from './code/code-module';
import { UIModule } from './ui/ui.module';


@NgModule({
    imports: [
        BrowserModule,
        UIModule,
        CoreModule,
        CodeModule,
        NoteModule
    ],
    declarations: [
        RootComponent
    ],
    bootstrap: [RootComponent]
})
export class RootModule {
}
