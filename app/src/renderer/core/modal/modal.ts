import { Injectable, Type } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


export type ModalActionName = 'open' | 'close';

export abstract class ModalHost {
    abstract inputs: any;
    abstract close(): void;
    abstract resolve(): void;
}

export class ModalOutlet {
    constructor(public component: Type<ModalHost>, public inputs: any = null) {
    }
}

export class ModalRef<R = any> {
    _afterOpen = new Subject<void>();
    _afterClosed = new Subject<R | undefined>();
    _beforeClose = new Subject<R | undefined>();

    constructor(public _outlet: ModalOutlet) {
    }

    get afterOpen(): Observable<any> {
        return this._afterOpen.asObservable();
    }

    get afterClosed(): Observable<any> {
        return this._afterClosed.asObservable();
    }

    get beforeClose(): Observable<any> {
        return this._beforeClose.asObservable();
    }

    destroy(): void {
        this._afterOpen.complete();
        this._afterClosed.complete();
        this._beforeClose.complete();
    }
}


@Injectable()
export class Modal {
    private currentRef: ModalRef = null;
    private overlayAttached = false;
    private _actions = new Subject<ModalActionName>();
    private _result: any;

    get actions(): Observable<ModalActionName> {
        return this._actions.asObservable();
    }

    open<R = any>(component: Type<ModalHost>, inputs: any = null): ModalRef<R> {
        this.currentRef = new ModalRef<R>(new ModalOutlet(component, inputs));
        this._actions.next('open');

        return this.currentRef;
    }

    close(result?: any): void {
        if (!this.currentRef || !this.overlayAttached) {
            return;
        }

        this._result = result;
        this.currentRef._beforeClose.next(this._result);
        this._actions.next('close');
    }

    _getCurrentOverlayRef(): ModalRef {
        return this.currentRef;
    }

    _overlayAttached(): void {
        if (!this.currentRef) {
            return;
        }

        this.currentRef._afterOpen.next();
        this.overlayAttached = true;
    }

    _overlayDetached(): void {
        if (!this.currentRef) {
            return;
        }

        this.currentRef._afterClosed.next(this._result);
        this.currentRef.destroy();
        this.currentRef = null;
        this.overlayAttached = false;
    }
}
