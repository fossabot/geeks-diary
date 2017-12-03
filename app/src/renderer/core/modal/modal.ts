import { Injectable, Type } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ModalHost } from './modal-host';


export enum ModalEventName {
    OPEN,
    CLOSE,
    RESOLVE
}

export class ModalEvent {
    constructor(public name: ModalEventName, public payload?: any) {}
}

export interface ModalRef {
    id: string;
    resolves
        : Observable<ModalEvent>;
}


let globalUniqueId = 0;

@Injectable()
export class Modal {
    private _opened = false;
    private _events = new Subject<ModalEvent>();
    private modalRef: ModalRef = null;

    get opened(): boolean {
        return this._opened;
    }

    get events(): Observable<ModalEvent> {
        return this._events.asObservable();
    }

    open(component: Type<ModalHost>, inputs?: any) {
        if (this.opened) {
            this.close();
        }

        const resolves = new Observable((observer: Observer<ModalEvent>) => {
            const events = this._events.subscribe((event: ModalEvent) => {
                if (!this.modalRef) {
                    return;
                }

                if (event.name === ModalEventName.RESOLVE) {
                    observer.next(event);
                    observer.complete();
                }

                if (event.name === ModalEventName.CLOSE) {
                    observer.next(event);
                    observer.complete();
                }
            });

            return () => {
                events.unsubscribe();
            };
        });

        this.modalRef = {
            id: `Modal-${globalUniqueId++}`,
            resolves
        };
        this._events.next(new ModalEvent(ModalEventName.OPEN, { component, inputs }));
        this._opened = true;

        return this.modalRef;
    }

    close() {
        this._events.next(new ModalEvent(ModalEventName.CLOSE));
        this.onCompleteClose();
    }

    resolve(payload?: any) {
        this._events.next(new ModalEvent(ModalEventName.RESOLVE, payload));
        this.onCompleteClose();
    }

    private onCompleteClose() {
        this.modalRef = null;
        this._opened = false;
    }
}
