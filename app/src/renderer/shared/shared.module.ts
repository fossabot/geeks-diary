import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DateHelperConfig } from './date-helper/date-helper-config';
import { DateHelper } from './date-helper/date-helper';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        DatePipe,
        DateHelperConfig,
        DateHelper
    ],
    exports: [
        CommonModule
    ]
})
export class SharedModule {

}
