import * as CodeMirror from 'codemirror';
import 'codemirror/mode/markdown/markdown';
import { NoteEditorSnippet, NoteEditorSnippetEventName } from './snippet';
import { BACKSPACE, DOWN_ARROW, ENTER, UP_ARROW } from '../../../../common/key-codes';


export class NoteTextEditorSnippet extends NoteEditorSnippet {
    static get className(): string {
        return 'NoteTextEditorSnippet';
    }

    type = 'text';
    private contentElem: HTMLElement;
    private editor: CodeMirror.Editor;

    constructor(containerElem: HTMLElement) {
        super(NoteTextEditorSnippet.className, containerElem);

        this.contentElem =
            this.containerElem.querySelector(`.${NoteTextEditorSnippet.className}__content`);
    }

    get editorOptions(): CodeMirror.EditorConfiguration {
        return {
            value: '',
            mode: 'markdown',
            indentUnit: 4,
            lineWrapping: true,
            lineNumbers: false,
            scrollbarStyle: 'null',
            autofocus: true
        };
    }

    get currentPositionIsTop(): boolean {
        const { line } = this.editor.getDoc().getCursor();

        return line === 0;
    }

    get currentPositionIsBottom(): boolean {
        const doc = this.editor.getDoc();

        return doc.getCursor().line === doc.lastLine();
    }

    init() {
        this.editor = CodeMirror(this.contentElem, this.editorOptions);

        this.editor.on('focus', () => {
            this.handleFocus(true);
        });

        this.editor.on('blur', () => {
            this.handleFocus(false);
        });

        this.editor.on('keydown', (c: any, event: KeyboardEvent) => {
            this.handleKeyDown(event);
        });

        this.contentElem.addEventListener('click', () => {
            this.focus();
        });

        this.focus();
    }

    destroy() {
        if (this._events) {
            this._events.complete();
            this._events = null;
        }
    }

    focus() {
        this.editor.focus();
    }

    setPositionToTop() {
        this.editor.getDoc().setCursor({
            ch: 0,
            line: 0
        });
    }

    setPositionToBottom() {
        const doc = this.editor.getDoc();

        doc.setCursor({
            ch: 0,
            line: doc.lastLine()
        });
    }

    private handleFocus(focused: boolean) {
        const className = `${NoteTextEditorSnippet.className}--focused`;
        this._focused = focused;

        const eventName = this.focused
            ? NoteEditorSnippetEventName.DID_FOCUS
            : NoteEditorSnippetEventName.DID_BLUR;

        this.containerElem.classList.remove(className);

        if (this.focused) {
            this.containerElem.classList.add(className);
        }

        this._events.next({
            name: eventName,
            targetId: this.id
        });
    }

    private handleKeyDown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case BACKSPACE:
                const value = this.editor.getDoc().getValue();

                if (value.trim() === '') {
                    this._events.next({
                        name: NoteEditorSnippetEventName.REMOVE_THIS,
                        targetId: this.id
                    });
                }
                break;

            case UP_ARROW:
                if (this.currentPositionIsTop) {
                    this._events.next({
                        name: NoteEditorSnippetEventName.MOVE_FOCUS_TO_PREVIOUS,
                        targetId: this.id
                    });
                }
                break;

            case DOWN_ARROW:
                if (this.currentPositionIsBottom) {
                    this._events.next({
                        name: NoteEditorSnippetEventName.MOVE_FOCUS_TO_NEXT,
                        targetId: this.id
                    });
                }
                break;

            case ENTER:
                if (event.shiftKey) {
                    event.preventDefault();

                    this._events.next({
                        name: NoteEditorSnippetEventName.CREATE_SNIPPET_ON_NEXT,
                        targetId: this.id
                    });
                }
                break;
        }
    }
}
