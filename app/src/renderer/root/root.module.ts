import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { RootComponent } from './root.component';


@NgModule({
    imports: [
        BrowserModule,
        CommonModule
    ],
    declarations: [
        RootComponent
    ],
    providers: [],
    bootstrap: [RootComponent]
})
export class RootModule {

}
