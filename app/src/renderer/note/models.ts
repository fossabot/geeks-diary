export interface NoteMetadata {
    id: string;
    title: string;
    createdAt: string;
    updatedAt?: string;
    fileName: string;
    status?: string;
}


export class NoteItem {
    private _id: string;
    private _title: string;
    private _createdAt: string;
    private _updatedAt: string;
    private _fileName: string;
    private _status: string;

    get id(): string { return this._id; }
    get title(): string { return this._title; }

    get createdAt(): Date {
        return new Date(this._createdAt);
    }

    get updatedAt(): Date {
        if (!this._updatedAt) {
            return null;
        }

        return new Date(this._updatedAt);
    }

    get fileName(): string { return this._fileName; }
    get status(): string { return this._status; }

    constructor(fileName: string, metadata: NoteMetadata) {
        this._id = metadata.id;
        this._title = metadata.title;
        this._createdAt = metadata.createdAt;
        this._updatedAt = metadata.updatedAt;
        this._fileName = fileName;
        this._status = metadata.status;
    }
}


export abstract class NoteBodySnippet {
    abstract type: string;
    value: string;
}

export class NoteBodyCodeSnippet extends NoteBodySnippet {
    type = 'code';
    fileName: string;
    language: string;
}

export class NoteBodyTextSnippet extends NoteBodySnippet {
    type = 'text';
}


export class NoteBody {
    constructor(private snippets: NoteBodySnippet[]) {
    }

    forEachSnippet(iterator: (item: NoteBodySnippet) => void) {
        this.snippets.forEach(snippet => iterator(snippet));
    }

    insertAfter(snippet: NoteBodySnippet, refIndex: number) {
        if (refIndex >= 0 && refIndex < this.snippets.length) {
            this.snippets.splice(refIndex, 0, snippet);
        }
    }

    remove(index: number) {
        if (this.snippets[index]) {
            this.snippets.splice(index, 1);
        }
    }

    change(snippet: NoteBodySnippet, index: number) {
        if (this.snippets[index]) {
            this.snippets[index] = snippet;
        }
    }
}
