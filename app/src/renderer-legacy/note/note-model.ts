export class NoteItem {

}


export interface NoteMetadata {
    id: string;
    title: string;
    createdAt: string;
    updatedAt?: string;
}


export class NoteBody {
    item: NoteItem;
    snippets: NoteSnippet[];
}


export abstract class NoteSnippet {
    value: string;
}


export class NoteCodeSnippet extends NoteSnippet {
}
