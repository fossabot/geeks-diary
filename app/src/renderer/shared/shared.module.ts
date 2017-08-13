import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DateHelperModule } from './date-helper/date-helper.module';


@NgModule({
    imports: [
        CommonModule,
        DateHelperModule
    ],
    declarations: [],
    providers: [],
    exports: [
        DateHelperModule
    ]
})
export class SharedModule {

}
