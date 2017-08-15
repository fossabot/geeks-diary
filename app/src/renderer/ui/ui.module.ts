import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from './button/button.component';
import { IconComponent } from './icon/icon.component';
import { ToolbarComponent } from './toolbar/toolbar.component';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ButtonComponent,
        IconComponent,
        ToolbarComponent
    ],
    providers: [],
    exports: [
        ButtonComponent,
        IconComponent,
        ToolbarComponent
    ]
})
export class UIModule {

}
