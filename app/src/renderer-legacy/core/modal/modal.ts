import { Injectable, Type } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ModalHost } from './modal-host';


export enum ModalEventName {
    OPEN,
    RESOLVE,
    CLOSE
}

export interface ModalEvent {
    name: ModalEventName;
    targetId: string;
    payload?: any;
}

export interface ModalRef {
    id: string;
    events: Observable<any>;
}


let globalId = 0;

@Injectable()
export class Modal {
    private _opened = false;
    private _events = new Subject<ModalEvent>();
    private currentModalRef: ModalRef;

    get opened(): boolean {
        return this._opened;
    }

    get events(): Observable<ModalEvent> {
        return this._events.asObservable();
    }

    open(component: Type<ModalHost>, inputs: any = null): ModalRef {
        if (this.opened) {
            this.close();
        }

        const events = new Observable((observer) => {
            const subscription = this._events.subscribe((e) => {
                if (!this.currentModalRef) {
                    return;
                }

                if (this.currentModalRef.id !== e.targetId) {
                    return;
                }

                observer.next(e);

                if (e.name === ModalEventName.CLOSE
                    || e.name === ModalEventName.RESOLVE) {
                    observer.complete();
                }

                return () => {
                    subscription.unsubscribe();
                };
            });
        });

        this.currentModalRef = {
            id: `Modal-${globalId++}`,
            events
        };

        this._events.next({
            name: ModalEventName.OPEN,
            targetId: this.currentModalRef.id,
            payload: { component, inputs }
        });

        this._opened = true;

        return this.currentModalRef;
    }

    close() {
        const id = this.opened ? this.currentModalRef.id : null;

        this._events.next({
            name: ModalEventName.CLOSE,
            targetId: id
        });

        this.currentModalRef = null;
        this._opened = false;
    }

    resolve(payload: any = null) {
        this._events.next({
            name: ModalEventName.RESOLVE,
            targetId: this.currentModalRef.id,
            payload
        });
    }
}
