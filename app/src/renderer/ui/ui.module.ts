import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { IconComponent } from './icon/icon.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { AutocompleteTriggerDirective } from './autocomplete/autocomplete-trigger.directive';
import { InputWrapperComponent } from './input/input-wrapper.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CALENDAR_TABLE_PROVIDER } from './calendar/calendar-table';
import { DateHelper } from './date-helper';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    declarations: [
        ButtonComponent,
        IconComponent,
        ToolbarComponent,
        InputWrapperComponent,
        AutocompleteComponent,
        AutocompleteTriggerDirective
    ],
    providers: [
        DatePipe,
        DateHelper,
        CALENDAR_TABLE_PROVIDER
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonComponent,
        IconComponent,
        ToolbarComponent,
        InputWrapperComponent,
        AutocompleteComponent,
        AutocompleteTriggerDirective
    ]
})
export class UIModule {
}
