import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DateHelperConfigService } from './date-helper-config.service';
import { DateHelper } from './date-helper';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        DatePipe,
        DateHelperConfigService,
        DateHelper
    ],
    exports: []
})
export class DateHelperModule {
}
