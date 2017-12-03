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
    REMOVE_THIS
}


let globalId = 0;

export abstract class NoteEditorSnippet {
    private _id: string;
    private _className: string;
    protected _events = new Subject<NoteEditorSnippetEvent>();
    protected _focused = false;
    protected containerElem: HTMLElement;

    abstract type: string;

    constructor(className: string, containerElem: HTMLElement) {
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


/*
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { CodeLanguageService } from '../../code/code-language.service';
import { domStyle } from '../../../common/utils/dom-style';


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
    REMOVE_THIS
}


let globalId = 0;

/!**
 Abstract class for implement note editor snippet
 *!/
export abstract class NoteEditorSnippet {
    static contentElemClassName = 'NOTE_CONTENT_TO_CREATE_MONACO_EDITOR';

    private _id: string;
    protected _events = new Subject<NoteEditorSnippetEvent>();
    protected _focused = false;
    protected containerElem: HTMLElement;
    protected contentElem: HTMLElement;
    protected monaco: any;
    protected editor: monaco.editor.IStandaloneCodeEditor = null;
    abstract type: string;

    constructor(public className: string, containerElem: HTMLElement) {
        this._id = `${className}-${globalId++}`;
        this.containerElem = containerElem;
        this.contentElem = <HTMLElement>containerElem.querySelector(
            `.${NoteEditorSnippet.contentElemClassName}`
        );

        this.containerElem.id = this.id;
        this.containerElem.classList.add(className);
        this.contentElem.classList.add(`${className}__content`);
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

    get currentPositionIsTop(): boolean {
        const { lineNumber } = this.editor.getPosition();

        return lineNumber === 1;
    }

    get currentPositionIsBottom(): boolean {
        const { lineNumber } = this.editor.getPosition();
        const lineCount = this.editor.getModel().getLineCount();

        return lineNumber === lineCount;
    }

    abstract get editorOptions(): monaco.editor.IEditorConstructionOptions;

    get editorTheme(): monaco.editor.IStandaloneThemeData {
        return {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {
                'foreground': '#212529',
                'editor.foreground': '#212529',
                'editor.background': '#ffffff',
                'editorSuggestWidget.background': '#e9ecef',
                'editorSuggestWidget.border': '#ced4da',
                'editorSuggestWidget.foreground': '#495057',
                'editorSuggestWidget.selectedBackground': '#72c3fc',
                'editorSuggestWidget.highlightForeground': '#1c7cd6'
            }
        };
    }

    init() {
        if ((<any>window).MONACO) {
            this.monaco = (<any>window).MONACO;
            this.createEditor();
        } else {
            (<any>window).REGISTER_MONACO_INIT_CALLBACK(() => {
                this.monaco = (<any>window).MONACO;
                this.createEditor();
            });
        }

        this._events.next({
            name: NoteEditorSnippetEventName.DID_INIT,
            targetId: this.id
        });
    }

    update(value: string) {
        this.editor.setValue(value);
    }

    destroy() {
        if (this.editor) {
            this.editor.dispose();
            this.editor = null;
        }

        if (this._events) {
            this._events.complete();
            this._events = null;
        }
    }

    focus() {
        this.editor.focus();
    }

    setPositionToTop() {
        this.editor.setPosition({
            column: 0,
            lineNumber: 1
        });
    }

    setPositionToBottom() {
        const lineCount = this.editor.getModel().getLineCount();

        this.editor.setPosition({
            column: 0,
            lineNumber: lineCount
        });
    }

    protected createEditor() {
        this.monaco.editor.defineTheme('geeksDiaryTheme', this.editorTheme);
        this.monaco.editor.setTheme('geeksDiaryTheme');

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

        /!* tslint:disable *!/
        this.editor.addCommand(keyMod.CtrlCmd | keyCode.KEY_F, () => {}, 'alwaysTrue');
        /!* tslint:enable *!/

        this.editor.focus();
        this.renderLayout();
    }

    protected renderLayout() {
        const contentWidth = this.contentElem.clientWidth;
        const values = this.editor.getModel().getValue();

        const lines = values.split('\n');
        let lineCount = lines.length;

        const column = Math.floor(contentWidth / 9);

        for (const line of lines) {
            if (line.length > column) {
                lineCount += Math.round(line.length / column);
            }
        }

        this.editor.updateOptions({
            wordWrapColumn: column
        });

        this.editor.layout({
            width: contentWidth,
            height: lineCount * this.editorOptions.lineHeight
        });
    }

    protected handleFocus(focused: boolean) {
        this._focused = focused;

        const eventName = this.focused
            ? NoteEditorSnippetEventName.DID_FOCUS
            : NoteEditorSnippetEventName.DID_BLUR;

        this.containerElem.classList.remove(`${this.className}--focused`);

        if (this.focused) {
            this.containerElem.classList.add(`${this.className}--focused`);
        }

        this._events.next({
            name: eventName,
            targetId: this.id
        });
    }

    protected handleKeyDown(event: monaco.IKeyboardEvent) {
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



export class NoteTextEditorSnippet extends NoteEditorSnippet {
    type = 'text';

    constructor(containerElem: HTMLElement) {
        super('NoteTextEditorSnippet', containerElem);
    }

    get editorOptions(): monaco.editor.IEditorConstructionOptions {
        return {
            value: '',
            language: 'markdown',
            codeLens: false,
            folding: true,
            fontFamily: 'Open Sans',
            fontSize: 14,
            lineNumbers: 'off',
            lineHeight: 21,
            glyphMargin: false,
            minimap: {
                enabled: false
            },
            find: {
                autoFindInSelection: false,
                seedSearchStringFromSelection: false
            },
            links: false,
            wordWrap: 'wordWrapColumn',
            wordWrapMinified: true,
            matchBrackets: false,
            occurrencesHighlight: false,
            overviewRulerLanes: 0,
            overviewRulerBorder: false,
            contextmenu: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            roundedSelection: false,
            renderLineHighlight: 'none'
        };
    }
}


export class NoteCodeEditorSnippet extends NoteEditorSnippet {
    static className = 'NoteCodeEditorSnippet';

    type = 'code';
    private _fileName: string;
    private _language: string;

    constructor(containerElem: HTMLElement, private codeLanguageService: CodeLanguageService) {
        super(NoteCodeEditorSnippet.className, containerElem);
    }

    get fileName(): string {
        return this._fileName;
    }

    get language(): string {
        return this._language;
    }

    get editorOptions(): monaco.editor.IEditorConstructionOptions {
        return {
            value: '',
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

    init() {
        this.render();
        super.init();
    }

    setFileName(fileName: string) {
        this._fileName = fileName;
    }

    setLanguage(language: string) {
        this._language = language;
    }

    private render() {
        const cn = NoteCodeEditorSnippet.className;

        const headerElem = document.createElement('header');
        headerElem.classList.add(`${cn}__header`);

        const content = `
            <span class="${cn}__fileName">${this.fileName}</span>
        `;

        const color = this.codeLanguageService.getLanguageColorById(this.language);
        domStyle(headerElem, { 'background-color': color });

        headerElem.innerHTML = content;

        this.containerElem.insertBefore(headerElem, this.contentElem);

        domStyle(this.contentElem, { 'border-color': color });

        const styleTag = document.createElement('style');
        const styleContent = `
            #${this.id} .monaco-editor .line-numbers {
                color: ${color} !important;
            }
        `;

        styleTag.textContent = styleContent;
        this.containerElem.insertBefore(styleTag, this.contentElem);
    }
}
*/


