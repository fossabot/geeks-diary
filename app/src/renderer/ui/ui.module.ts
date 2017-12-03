import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { IconComponent } from './icon/icon.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { AutocompleteTriggerDirective } from './autocomplete/autocomplete-trigger.directive';
import { InputWrapperComponent } from './input/input-wrapper.component';
import { ReactiveFormsModule } from '@angular/forms';


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
    providers: [],
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
