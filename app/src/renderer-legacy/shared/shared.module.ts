import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DateHelper } from './date-helper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputWrapperComponent } from './input/input-wrapper.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        InputWrapperComponent
    ],
    providers: [
        DatePipe,
        DateHelper
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputWrapperComponent
    ]
})
export class SharedModule {

}
