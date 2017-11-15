import { Component, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ModalHost } from './modal-host';
import { Modal, ModalEvent, ModalEventName } from './modal';


@Component({
    selector: 'app-modal-container',
    templateUrl: './modal-container.component.html',
    styleUrls: ['./modal-container.component.less']
})
export class ModalContainerComponent implements OnInit, OnDestroy {
    private currentModalComponentRef: ComponentRef<ModalHost>;
    private modalEventsSubscription: Subscription;
    @ViewChild('modalHost', { read: ViewContainerRef }) modalHostView;
    opened = false;

    constructor(private modal: Modal, private componentFactoryResolver: ComponentFactoryResolver) {
    }

    get showModal(): boolean {
        return this.opened;
    }

    ngOnInit() {
        this.modalEventsSubscription = this.modal.events.subscribe(
            modalEvent => this.handleModalEvents(modalEvent)
        );
    }

    ngOnDestroy() {
        if (this.modalEventsSubscription) {
            this.modalEventsSubscription.unsubscribe();
        }
    }

    private openModal(component: Type<ModalHost>, inputs: any = null) {
        if (this.opened) {
            this.closeModal();
        }

        const factory = this.componentFactoryResolver.resolveComponentFactory(component);
        this.currentModalComponentRef = this.modalHostView.createComponent(factory);

        const instance = this.currentModalComponentRef.instance;
        instance.inputs = inputs;

        this.opened = true;
    }

    private closeModal() {
        if (this.opened) {
            if (this.currentModalComponentRef) {
                this.currentModalComponentRef.destroy();
                this.currentModalComponentRef = null;
            }

            this.modalHostView.clear();
            this.opened = false;
        }
    }

    private handleModalEvents(event: ModalEvent) {
        switch (event.name) {
            case ModalEventName.OPEN:
                this.openModal(event.payload.component, event.payload.inputs);
                break;
            case ModalEventName.CLOSE:
                this.closeModal();
                break;
            default:
                return;
        }
    }
}
