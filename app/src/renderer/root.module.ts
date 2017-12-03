import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NoteModule } from './note/note.module';
import { RootComponent } from './root.component';
import { CoreModule } from './core/core.module';
import { CodeModule } from './code/code-module';


@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
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
