import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UIModule } from '../ui/ui.module';
import { DateHelper } from './date-helper';
import { ModalContainerComponent } from './modal/modal-container.component';
import { Modal } from './modal/modal';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
    imports: [
        UIModule
    ],
    declarations: [
        ModalContainerComponent,
        SidebarComponent
    ],
    providers: [
        Modal,
        DatePipe,
        DateHelper
    ],
    exports: [
        ModalContainerComponent,
        SidebarComponent
    ]
})
export class CoreModule {
}
