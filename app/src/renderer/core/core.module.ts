import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ModalContainerComponent } from './modal/modal-container.component';
import { Modal } from './modal/modal';


@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        ModalContainerComponent
    ],
    providers: [
        Modal
    ],
    exports: [
        ModalContainerComponent
    ]
})
export class CoreModule {

}
