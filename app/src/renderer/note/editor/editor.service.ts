import { Injectable, NgZone, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ArrayMap } from '../../../common/utils/array-map';
import { NoteEditorSnippet, NoteEditorSnippetEvent, NoteEditorSnippetEventName } from './snippets/snippet';
import { NoteTextEditorSnippet } from './snippets/text-editor-snippet';
import { NoteCodeEditorSnippet } from './snippets/code-editor-snippet';
import { Modal, ModalEventName } from '../../core/modal/modal';
import { NoteCodeEditorSnippetCreateModalComponent } from './code-editor-snippet-create-modal.component';
import { NoteBody, NoteBodyCodeSnippet, NoteBodySnippet, NoteBodyTextSnippet } from '../models';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


interface NoteEditorServiceInjection {
    renderer: Renderer2;
}

export interface NoteBodyValueChanges {
    index: number;
    value: string;
}


@Injectable()
export class NoteEditorService {
    private _snippets = new ArrayMap<NoteEditorSnippet>();
    private _snippetEventSubscriptions = new ArrayMap<Subscription>();

    private _valueChanges = new Subject<NoteBodyValueChanges>();

    private containerElem: HTMLElement;
    private renderer: Renderer2;

    private _initialized = false;

    constructor(private ngZone: NgZone,
                private modal: Modal) {
    }

    get snippets(): NoteEditorSnippet[] {
        return this._snippets.values;
    }

    get snippetEventSubscriptions(): Subscription[] {
        return this._snippetEventSubscriptions.values;
    }

    get valueChanges(): Observable<NoteBodyValueChanges> {
        return this._valueChanges.asObservable();
    }

    get initialized(): boolean {
        return this._initialized;
    }

    init(containerElem: HTMLElement, injection: NoteEditorServiceInjection): void {
        this.containerElem = containerElem;
        this.renderer = injection.renderer;

        this._initialized = true;
    }

    clear(): void {
        this._snippets.forEach((snippet) => {
            this.removeSnippet(snippet.id);
        });
    }

    parseNoteBody(noteBody: NoteBody): void {
        this.clear();

        let refSnippetId;

        // Insert each snippet.
        noteBody.forEachSnippet((noteBodySnippet) => {
            const newSnippet = this.createSnippetInstance(noteBodySnippet);

            this.insertSnippet(newSnippet, refSnippetId);
            refSnippetId = newSnippet.id;
        });

        this._snippets.getAt(0).focus();
    }

    createSnippetInstance(noteBodySnippet: NoteBodySnippet): NoteEditorSnippet {
        switch (noteBodySnippet.type) {
            case 'text':
                return this.createTextSnippetInstance(noteBodySnippet as NoteBodyTextSnippet);
            case 'code':
                return this.createCodeSnippetInstance(noteBodySnippet as NoteBodyCodeSnippet);
            default: throw new Error();
        }
    }

    transposeSnippet(refSnippetId: string): void {
        if (!this._snippets.hasKey(refSnippetId)) {
            return;
        }

        const refSnippet = this._snippets.get(refSnippetId);
        let newSnippet;

        if (refSnippet.type === 'text') {
            this.modal.open(NoteCodeEditorSnippetCreateModalComponent)
                .resolves.subscribe((event) => {

                if (event.name === ModalEventName.RESOLVE) {
                    const { fileName, language } = event.payload;

                    newSnippet = this.createCodeSnippetInstance({
                        type: 'code',
                        value: '',
                        fileName,
                        language
                    });

                    this.insertSnippet(newSnippet, refSnippetId);
                } else if (event.name === ModalEventName.CLOSE) {
                    this.moveFocus(refSnippetId, 0);
                }
            });
        } else if (refSnippet.type === 'code') {
            newSnippet = this.createTextSnippetInstance({
                type: 'text',
                value: ''
            });
            this.insertSnippet(newSnippet, refSnippetId);
        }
    }

    insertSnippet(newSnippet: NoteEditorSnippet, refSnippetId?: string): void {
        let index;

        if (!refSnippetId) {
            this.renderer.appendChild(this.containerElem, newSnippet.domNode);
            newSnippet.init();
            this._snippets.insert(newSnippet.id, newSnippet);
            this._snippetEventSubscriptions.insert(
                newSnippet.id,
                newSnippet.events.subscribe(event => this.handleSnippetEvent(event))
            );
            return;
        }

        if (!this._snippets.hasKey(refSnippetId)) {
            return;
        }

        index = this._snippets.indexOfKey(refSnippetId);

        // Insert snippet dom node.
        if (index === this._snippets.size - 1) {
            this.renderer.appendChild(this.containerElem, newSnippet.domNode);
        } else {
            const snippetElemList = this.containerElem.querySelectorAll('.NoteEditorSnippet');
            const refSnippetElem = snippetElemList[index + 1];

            this.renderer.insertBefore(this.containerElem, newSnippet.domNode, refSnippetElem);
        }

        // Initialize snippet.
        newSnippet.init();

        // Insert snippet instance.
        this._snippets.insertAfter(newSnippet.id, newSnippet, refSnippetId);
        this._snippetEventSubscriptions.insertAfter(
            newSnippet.id,
            newSnippet.events.subscribe(event => this.handleSnippetEvent(event)),
            refSnippetId
        );
    }

    removeSnippet(snippetId: string): void {
        if (this._snippets.hasKey(snippetId)) {
            const snippet = this._snippets.get(snippetId);

            snippet.destroy();

            this.renderer.removeChild(this.containerElem, snippet.domNode);
            this._snippets.remove(snippetId);
        }

        if (this._snippetEventSubscriptions.hasKey(snippetId)) {
            const subscription = this._snippetEventSubscriptions.get(snippetId);

            if (subscription) {
                subscription.unsubscribe();
            }

            this._snippetEventSubscriptions.remove(snippetId);
        }
    }

    moveFocus(refSnippetId: string, direction: number): void {
        if (!this._snippets.hasKey(refSnippetId)) {
            return;
        }

        const index = this._snippets.indexOfKey(refSnippetId);
        const nextSnippet = this._snippets.getAt(index + direction);

        if (!nextSnippet) {
            return;
        }

        nextSnippet.focus();

        if (direction > 0) {
            nextSnippet.setPositionToTop();
        } else if (direction < 0) {
            nextSnippet.setPositionToBottom();
        }
    }

    private createTextSnippetInstance(noteTextBodySnippet: NoteBodyTextSnippet): NoteTextEditorSnippet {
        const snippetElem = this.renderer.createElement('div');
        const contentElem = this.renderer.createElement('div');

        this.renderer.addClass(snippetElem, 'NoteEditorSnippet');
        this.renderer.addClass(contentElem, 'NoteEditorSnippet__content');

        this.renderer.addClass(snippetElem, NoteTextEditorSnippet.className);
        this.renderer.addClass(contentElem, `${NoteTextEditorSnippet.className}__content`);
        this.renderer.appendChild(snippetElem, contentElem);

        return new NoteTextEditorSnippet(snippetElem, noteTextBodySnippet.value);
    }

    private createCodeSnippetInstance(noteCodeBodySnippet: NoteBodyCodeSnippet): NoteCodeEditorSnippet {
        const snippetElem = this.renderer.createElement('div');
        const contentElem = this.renderer.createElement('div');

        this.renderer.addClass(snippetElem, 'NoteEditorSnippet');
        this.renderer.addClass(contentElem, 'NoteEditorSnippet__content');

        this.renderer.addClass(snippetElem, NoteCodeEditorSnippet.className);
        this.renderer.addClass(contentElem, `${NoteCodeEditorSnippet.className}__content`);
        this.renderer.appendChild(snippetElem, contentElem);

        const snippet = new NoteCodeEditorSnippet(snippetElem, noteCodeBodySnippet.value);
        snippet.setFileName(noteCodeBodySnippet.fileName);
        snippet.setLanguage(noteCodeBodySnippet.language);

        return snippet;
    }

    private handleSnippetEvent(event: NoteEditorSnippetEvent): void {
        this.ngZone.run(() => {
            switch (event.name) {
                case NoteEditorSnippetEventName.VALUE_CHANGED:
                    const snippetIndex = this._snippets.indexOfKey(event.targetId);

                    this._valueChanges.next({
                        index: snippetIndex,
                        value: event.payload
                    });
                    break;

                case NoteEditorSnippetEventName.CREATE_SNIPPET_ON_NEXT:
                    this.transposeSnippet(event.targetId);
                    break;

                case NoteEditorSnippetEventName.REMOVE_THIS:
                    if (this._snippets.size === 1) {
                        return;
                    }

                    if (this._snippets.indexOfKey(event.targetId) === 0) {
                        this.moveFocus(event.targetId, 1);
                    } else {
                        this.moveFocus(event.targetId, -1);
                    }

                    this.removeSnippet(event.targetId);
                    break;

                case NoteEditorSnippetEventName.MOVE_FOCUS_TO_NEXT:
                    this.moveFocus(event.targetId, 1);
                    break;

                case NoteEditorSnippetEventName.MOVE_FOCUS_TO_PREVIOUS:
                    this.moveFocus(event.targetId, -1);
                    break;
            }
        });
    }
}
