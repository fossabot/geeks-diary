import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CodeLanguageService } from './code-language.service';


@NgModule({
    imports: [
        SharedModule
    ],
    providers: [
        CodeLanguageService
    ]
})
export class CodeModule {
}
