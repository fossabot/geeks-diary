import { Injectable, NgZone, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ArrayMap } from '../../../common/utils/array-map';
import { NoteEditorSnippet, NoteEditorSnippetEvent, NoteEditorSnippetEventName } from './snippets/snippet';
import { NoteTextEditorSnippet } from './snippets/text-editor-snippet';
import { NoteCodeEditorSnippet } from './snippets/code-editor-snippet';
import { Modal, ModalEventName } from '../../core/modal/modal';
import { NoteCodeEditorSnippetCreateModalComponent } from './code-editor-snippet-create-modal.component';


interface NoteEditorServiceInjection {
    renderer: Renderer2;
}


@Injectable()
export class NoteEditorService {
    private _snippets = new ArrayMap<NoteEditorSnippet>();
    private _snippetEventSubscriptions = new ArrayMap<Subscription>();

    private containerElem: HTMLElement;
    private renderer: Renderer2;

    constructor(private ngZone: NgZone,
                private modal: Modal) {
    }

    get snippets(): NoteEditorSnippet[] {
        return this._snippets.values;
    }

    get snippetEventSubscriptions(): Subscription[] {
        return this._snippetEventSubscriptions.values;
    }

    init(containerElem: HTMLElement, injection: NoteEditorServiceInjection) {
        this.containerElem = containerElem;
        this.renderer = injection.renderer;

        const newSnippet = this.createSnippetInstance();
        this.renderer.appendChild(this.containerElem, newSnippet.domNode);
        newSnippet.init();

        this._snippets.put(newSnippet.id, newSnippet);
        this._snippetEventSubscriptions.put(
            newSnippet.id,
            newSnippet.events.subscribe(event => this.handleSnippetEvent(event))
        );
    }

    createSnippetInstance(type: 'text'|'code' = 'text'): NoteEditorSnippet {
        const snippetElem = this.renderer.createElement('div');
        const contentElem = this.renderer.createElement('div');

        this.renderer.addClass(snippetElem, 'NoteEditorSnippet');
        this.renderer.addClass(contentElem, 'NoteEditorSnippet__content');

        switch (type) {
            case 'text':
                this.renderer.addClass(snippetElem, NoteTextEditorSnippet.className);
                this.renderer.addClass(contentElem, `${NoteTextEditorSnippet.className}__content`);
                this.renderer.appendChild(snippetElem, contentElem);

                return new NoteTextEditorSnippet(snippetElem);

            case 'code':
                this.renderer.addClass(snippetElem, NoteCodeEditorSnippet.className);
                this.renderer.addClass(contentElem, `${NoteCodeEditorSnippet.className}__content`);
                this.renderer.appendChild(snippetElem, contentElem);

                return new NoteCodeEditorSnippet(snippetElem);
            default: throw new Error();
        }
    }

    transposeSnippet(refSnippetId: string) {
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

                    newSnippet = this.createSnippetInstance('code');
                    newSnippet.setFileName(fileName);
                    newSnippet.setLanguage(language);

                    this.insertSnippet(newSnippet, refSnippetId);
                } else if (event.name === ModalEventName.CLOSE) {
                    this.moveFocus(refSnippetId, 0);
                }
            });
        } else if (refSnippet.type === 'code') {
            newSnippet = this.createSnippetInstance('text');
            this.insertSnippet(newSnippet, refSnippetId);
        }
    }

    insertSnippet(newSnippet: NoteEditorSnippet, refSnippetId?: string) {
        let index;

        if (!this._snippets.hasKey(refSnippetId)) {
            return;
        }

        index = this._snippets.indexOfKey(refSnippetId);

        // Insert snippet dom node.
        if (index === this._snippets.size - 1) {
            this.renderer.appendChild(this.containerElem, newSnippet.domNode);
        } else {
            const snippetElems = this.containerElem.querySelectorAll('.NoteEditorSnippet');
            const refSnippetElem = snippetElems[index + 1];

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

    removeSnippet(snippetId: string) {
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

    moveFocus(refSnippetId: string, direction: number) {
        if (!this._snippets.hasKey(refSnippetId)) {
            return;
        }

        const index = this._snippets.indexOfKey(refSnippetId);
        const nextSnippet = this._snippets.getAt(index + direction);

        if (nextSnippet) {
            nextSnippet.focus();

            if (direction > 0) {
                nextSnippet.setPositionToTop();
            } else if (direction < 0) {
                nextSnippet.setPositionToBottom();
            }
        }
    }

    private handleSnippetEvent(event: NoteEditorSnippetEvent) {
        this.ngZone.run(() => {
            switch (event.name) {
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
