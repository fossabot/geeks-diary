import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DateHelper } from './date-helper';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        DatePipe,
        DateHelper
    ],
    exports: [
        CommonModule
    ]
})
export class SharedModule {

}
