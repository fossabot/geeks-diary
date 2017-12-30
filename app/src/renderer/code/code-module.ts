import { NgModule } from '@angular/core';
import { CodeLanguageService } from './language.service';
import { CodeTechStackService } from './tech-stack.service';
import { CodeTechStackItemComponent } from './tech-stack-item/tech-stack-item.component';
import { CodeTechStackInputComponent } from './tech-stack-input/tech-stack-input.component';
import { UIModule } from '../ui/ui.module';


@NgModule({
    imports: [
        UIModule
    ],
    declarations: [
        CodeTechStackItemComponent,
        CodeTechStackInputComponent
    ],
    providers: [
        CodeLanguageService,
        CodeTechStackService
    ],
    exports: [
        CodeTechStackItemComponent,
        CodeTechStackInputComponent
    ]
})
export class CodeModule {
}
