import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../core/core.module';
import { UIModule } from '../ui/ui.module';

import { NoteModule } from '../note/note.module';

import { ActivityViewComponent } from './activity-view/activity-view.component';
import { RootComponent } from './root.component';
import { CodeModule } from '../code/code.module';


@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        CoreModule,
        UIModule,
        NoteModule,
        CodeModule
    ],
    declarations: [
        ActivityViewComponent,
        RootComponent
    ],
    providers: [],
    bootstrap: [RootComponent]
})
export class RootModule {

}
