import {
    Component, ComponentFactoryResolver, ComponentRef,
    OnDestroy, OnInit, Type, ViewChild, ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ModalHost } from './modal-host';
import { Modal, ModalEvent, ModalEventName } from './modal';


@Component({
    selector: 'core-modal-container',
    templateUrl: './modal-container.component.html',
    styleUrls: ['./modal-container.component.less']
})
export class ModalContainerComponent implements OnInit, OnDestroy {
    @ViewChild('modalHost', { read: ViewContainerRef }) modalHostView: ViewContainerRef;
    opened = false;

    private modalComponentRef: ComponentRef<ModalHost>;
    private modalEventSubscription: Subscription;

    constructor(private modal: Modal,
                private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngOnInit() {
        this.modalEventSubscription = this.modal.events.subscribe((event) => {
            this.handleModalEvent(event);
        });
    }

    ngOnDestroy() {
        if (this.modalEventSubscription) {
            this.modalEventSubscription.unsubscribe();
        }
    }

    private handleModalEvent(event: ModalEvent) {
        switch (event.name) {
            case ModalEventName.OPEN:
                this.openModal(event.payload.component, event.payload.inputs);
                break;
            case ModalEventName.RESOLVE:
            case ModalEventName.CLOSE:
                this.closeModal();
                break;
        }
    }

    private openModal(component: Type<ModalHost>, inputs: any = null) {
        const factory = this.componentFactoryResolver.resolveComponentFactory(component);
        this.modalComponentRef = this.modalHostView.createComponent(factory);

        const instance = this.modalComponentRef.instance;
        instance.inputs = inputs;

        this.opened = true;
    }

    private closeModal() {
        if (this.modalComponentRef) {
            this.modalComponentRef.destroy();
            this.modalComponentRef = null;
        }

        this.modalHostView.clear();
        this.opened = false;
    }

}
