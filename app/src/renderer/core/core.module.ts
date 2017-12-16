import { NgModule } from '@angular/core';
import { UIModule } from '../ui/ui.module';
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
        Modal
    ],
    exports: [
        ModalContainerComponent,
        SidebarComponent
    ]
})
export class CoreModule {
}
