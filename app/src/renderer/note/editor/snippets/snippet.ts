import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


export interface NoteEditorSnippetEvent {
    name: NoteEditorSnippetEventName;
    targetId: string;
    payload?: any;
}

export enum NoteEditorSnippetEventName {
    DID_INIT,
    DID_FOCUS,
    DID_BLUR,
    MOVE_FOCUS_TO_PREVIOUS,
    MOVE_FOCUS_TO_NEXT,
    CREATE_SNIPPET_ON_NEXT,
    REMOVE_THIS,
    VALUE_CHANGED
}


let globalId = 0;

export abstract class NoteEditorSnippet {
    private _id: string;
    private _className: string;
    protected _events = new Subject<NoteEditorSnippetEvent>();
    protected _focused = false;
    protected containerElem: HTMLElement;

    abstract type: string;

    constructor(className: string, containerElem: HTMLElement, protected initialValue: string) {
        this._className = className;
        this._id = `${this._className}-${globalId++}`;

        this.containerElem = containerElem;
        this.containerElem.id = this.id;
    }

    get id(): string {
        return this._id;
    }

    get events(): Observable<NoteEditorSnippetEvent> {
        return this._events.asObservable();
    }

    get focused(): boolean {
        return this._focused;
    }

    get domNode(): HTMLElement {
        return this.containerElem;
    }

    abstract get currentPositionIsTop(): boolean;
    abstract get currentPositionIsBottom(): boolean;
    abstract init(): void;
    abstract destroy(): void;
    abstract focus(): void;
    abstract setPositionToTop(): void;
    abstract setPositionToBottom(): void;
}
