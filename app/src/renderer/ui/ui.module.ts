import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from './button/button.component';
import { IconComponent } from './icon/icon.component';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ButtonComponent,
        IconComponent
    ],
    providers: [],
    exports: [
        ButtonComponent,
        IconComponent
    ]
})
export class UIModule {

}
