import { domStyle } from '../../../../common/utils/dom-style';
import { NoteEditorSnippet, NoteEditorSnippetEventName } from './snippet';
import { CodeLanguage } from '../../../code/language.service';


export class NoteCodeEditorSnippet extends NoteEditorSnippet {
    static get className(): string {
        return 'NoteCodeEditorSnippet';
    }

    type = 'code';
    private monaco: any;
    private contentElem: HTMLElement;
    private editor: monaco.editor.IStandaloneCodeEditor;
    private _fileName: string;
    private _language: string;

    constructor(containerElem: HTMLElement, initialValue: string = '') {
        super(NoteCodeEditorSnippet.className, containerElem, initialValue);

        this.contentElem =
            <HTMLElement>this.containerElem.querySelector(
                `.${NoteCodeEditorSnippet.className}__content`
            );
    }

    get fileName(): string {
        return this._fileName;
    }

    get language(): string {
        return this._language;
    }

    get editorOptions(): monaco.editor.IEditorConstructionOptions {
        return {
            value: this.initialValue,
            language: this.language,
            codeLens: false,
            fontSize: 14,
            lineHeight: 21,
            glyphMargin: false,
            minimap: {
                enabled: false
            },
            overviewRulerLanes: 0,
            overviewRulerBorder: false,
            contextmenu: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            roundedSelection: false,
            renderLineHighlight: 'none'
        };
    }

    get currentPositionIsTop(): boolean {
        const { lineNumber } = this.editor.getPosition();

        return lineNumber === 1;
    }

    get currentPositionIsBottom(): boolean {
        const { lineNumber } = this.editor.getPosition();
        const lineCount = this.editor.getModel().getLineCount();

        return lineNumber === lineCount;
    }

    init(): void {
        if ((<any>window).MONACO) {
            this.monaco = (<any>window).MONACO;
            this.render();
            this.createEditor();
        } else {
            (<any>window).REGISTER_MONACO_INIT_CALLBACK(() => {
                this.monaco = (<any>window).MONACO;
                this.render();
                this.createEditor();
            });
        }

        this._events.next({
            name: NoteEditorSnippetEventName.DID_INIT,
            targetId: this.id
        });
    }

    destroy(): void {
        if (this.editor) {
            this.editor.dispose();
            this.editor = null;
        }

        if (this._events) {
            this._events.complete();
            this._events = null;
        }
    }

    focus(): void {
        this.editor.focus();
    }

    setPositionToTop(): void {
        this.editor.setPosition({
            column: 0,
            lineNumber: 1
        });
    }

    setPositionToBottom(): void {
        const lineCount = this.editor.getModel().getLineCount();

        this.editor.setPosition({
            column: 0,
            lineNumber: lineCount
        });
    }

    setFileName(fileName: string): void {
        this._fileName = fileName;
    }

    setLanguage(language: string): void {
        this._language = language;
    }

    private createEditor(): void {
        this.editor = this.monaco.editor.create(this.contentElem, this.editorOptions);

        this.editor.onDidFocusEditor(() => {
            this.handleFocus(true);
        });

        this.editor.onDidBlurEditor(() => {
            this.handleFocus(false);
        });

        this.editor.onDidChangeModelContent(() => {
            this.renderLayout();
        });

        this.editor.onKeyDown((event: monaco.IKeyboardEvent) => {
            this.handleKeyDown(event);
        });

        this.contentElem.addEventListener('click', () => {
            this.focus();
        });

        this.editor.createContextKey('alwaysTrue', true);

        const keyMod = this.monaco.KeyMod;
        const keyCode = this.monaco.KeyCode;

        /* tslint:disable */
        this.editor.addCommand(keyMod.CtrlCmd | keyCode.KEY_F, () => {}, 'alwaysTrue');
        /* tslint:enable */

        this.renderLayout();
    }

    private renderLayout(): void {
        const contentWidth = this.contentElem.clientWidth;
        const lineCount = this.editor.getModel().getLineCount();

        this.editor.layout({
            width: contentWidth,
            height: lineCount * this.editorOptions.lineHeight + 10
        });
    }

    private render(): void {
        const cn = NoteCodeEditorSnippet.className;

        const headerElem = document.createElement('header');
        headerElem.classList.add(`${cn}__header`);

        const content = `
            <span class="${cn}__fileName">${this.fileName}</span>
        `;

        const languages = this.monaco.languages.getLanguages();
        const language = languages.find(l => l.id === this.language);
        const color = CodeLanguage.createFromMonaco(language).color;
        domStyle(headerElem, { 'background-color': color });

        headerElem.innerHTML = content;

        this.containerElem.insertBefore(headerElem, this.contentElem);

        domStyle(this.contentElem, { 'border-color': color });

        const styleTag = document.createElement('style');
        styleTag.textContent = `
            #${this.id} .monaco-editor .line-numbers {
                color: ${color} !important;
            }
        `;

        this.containerElem.insertBefore(styleTag, this.contentElem);
    }

    private handleFocus(focused: boolean): void {
        const className = `${NoteCodeEditorSnippet.className}--focused`;
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

    private handleKeyDown(event: monaco.IKeyboardEvent): void {
        const keyCodes = this.monaco.KeyCode;

        switch (event.keyCode) {
            case keyCodes.Backspace:
                const modelContent = this.editor.getModel().getValue();

                if (modelContent.trim() === '') {
                    this._events.next({
                        name: NoteEditorSnippetEventName.REMOVE_THIS,
                        targetId: this.id
                    });
                }
                break;

            case keyCodes.UpArrow:
                if (this.currentPositionIsTop) {
                    this._events.next({
                        name: NoteEditorSnippetEventName.MOVE_FOCUS_TO_PREVIOUS,
                        targetId: this.id
                    });
                }
                break;

            case keyCodes.DownArrow:
                if (this.currentPositionIsBottom) {
                    this._events.next({
                        name: NoteEditorSnippetEventName.MOVE_FOCUS_TO_NEXT,
                        targetId: this.id
                    });
                }
                break;

            case keyCodes.Enter:
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
