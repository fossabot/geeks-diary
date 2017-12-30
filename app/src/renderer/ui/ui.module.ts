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
import { FormFieldComponent } from './form/form-field.component';
import { FormErrorMessageComponent } from './form/form-error-message.component';
import { PrefixDirective } from './form/prefix.directive';
import { SuffixDirective } from './form/suffix.directive';
import { InputDirective } from './form/input.directive';
import { OptionItemDirective } from './autocomplete/option-item.directive';


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
        AutocompleteTriggerDirective,
        OptionItemDirective,
        FormFieldComponent,
        FormErrorMessageComponent,
        PrefixDirective,
        SuffixDirective,
        InputDirective
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
        AutocompleteTriggerDirective,
        OptionItemDirective,
        FormFieldComponent,
        FormErrorMessageComponent,
        PrefixDirective,
        SuffixDirective,
        InputDirective
    ]
})
export class UIModule {
}
