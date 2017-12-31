import { Component, ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { Modal, ModalHost, ModalRef } from './modal';
import { flyInFromBottomAnimation } from '../../ui/animations';


@Component({
    selector: 'core-modal-container',
    templateUrl: './modal-container.component.html',
    styleUrls: ['./modal-container.component.less'],
    animations: [flyInFromBottomAnimation]
})
export class ModalContainerComponent {
    state = 'disable';
    opened = false;
    @ViewChild('attachmentPlace', { read: ViewContainerRef }) attachmentPlace: ViewContainerRef;

    private currentModalRef: ModalRef;
    currentModalHostComponentRef: ComponentRef<ModalHost>;

    constructor(private modal: Modal,
                private componentFactoryResolver: ComponentFactoryResolver) {
        this.modal.actions
            .subscribe((action) => {
                switch (action) {
                    case 'open': this.attach(); break;
                    case 'close': this.detach(); break;
                }
            });
    }

    attach(): void {
        this.removeComponentRef();

        this.currentModalRef = this.modal._getCurrentOverlayRef();

        const factory = this.componentFactoryResolver
            .resolveComponentFactory(this.currentModalRef._outlet.component);

        this.currentModalHostComponentRef = this.attachmentPlace.createComponent(factory);
        this.currentModalHostComponentRef.instance.inputs = this.currentModalRef._outlet.inputs;

        this.opened = true;
        this.state = 'active';
    }

    detach(): void {
        this.state = 'disable';
    }

    onAnimationDone(event: AnimationEvent): void {
        if (event.toState === 'active') {
            this.modal._overlayAttached();
        }

        if (event.fromState === 'active'
            && event.toState === 'disable'
            && this.opened) {
            this.opened = false;
            this.modal._overlayDetached();
            this.removeComponentRef();
        }
    }

    private removeComponentRef(): void {
        if (this.currentModalHostComponentRef) {
            this.currentModalHostComponentRef.destroy();
        }

        this.currentModalHostComponentRef = null;
    }
}
