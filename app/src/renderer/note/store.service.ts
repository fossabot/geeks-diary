import { Injectable } from '@angular/core';
import * as path from 'path';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { NoteBody, NoteBodySnippet, NoteItem, NoteMetadata } from './models';
import { environment } from '../../config/environment';
import { readdirAsObservable, readFileAsObservable, writeFileAsObservable } from '../../common/utils/fs-helpers';


@Injectable()
export class NoteStoreService {
    private noteStorePath = path.resolve(environment.getPath('userData'), 'notes/');
    private subscriptions: Subscription[] = [];

    private noteItemsStream = new BehaviorSubject<NoteItem[]>([]);
    private noteItemSelectionStream = new BehaviorSubject<NoteItem>(null);
    private noteBodyStream = new Subject<NoteBody>();
    private noteBodySaveStream = new Subject<void>();
    private _errors = new Subject<Error | any>();

    constructor() {
        this.pullNoteItems();
        this.registerReadNoteBodySource(this.noteItemSelectionStream);
    }

    get noteItems(): Observable<NoteItem[]> {
        return this.noteItemsStream.asObservable();
    }

    get noteItemSelection(): Observable<NoteItem> {
        return this.noteItemSelectionStream.asObservable();
    }

    get noteBody(): Observable<NoteBody> {
        return this.noteBodyStream.asObservable();
    }

    get errors(): Observable<Error | any> {
        return this._errors.asObservable();
    }

    pullNoteItems() {
        const instanceObservable = Observable.create((observer) => {
            observer.next();
            observer.complete();
        });

        this.registerReadAllNoteItemsSource(instanceObservable);
    }

    registerReadAllNoteItemsSource(source: Observable<any>): Subscription {
        const stream = source.pipe(
            switchMap(() => this.findNoteFiles()),
            switchMap((noteFiles) => {
                const tasks = [];

                noteFiles.forEach(fileName => tasks.push(
                    this.readNoteItem(fileName)
                ));

                return combineLatest(tasks);
            })
        );

        const subscription = stream.subscribe(this.noteItemsStream);
        this.subscriptions.push(subscription);

        return subscription;
    }

    registerSelectNoteItemSource(source: Observable<NoteItem>): Subscription {
        const subscription = source.pipe(distinctUntilChanged()).subscribe((noteItem) => {
            this.noteItemSelectionStream.next(noteItem);
        });

        this.subscriptions.push(subscription);

        return subscription;
    }

    registerReadNoteBodySource(source: Observable<NoteItem>): Subscription {
        const stream = source.pipe(
            filter(noteItem => noteItem !== null),
            switchMap(noteItem => this.readNoteBody(noteItem))
        );

        const subscription = stream.subscribe(this.noteBodyStream);
        this.subscriptions.push(subscription);

        return subscription;
    }

    registerSaveNoteBodySource(noteBodySource: Observable<NoteBody>,
                               noteItemSource: Observable<NoteItem> = this.noteItemSelection): Subscription {
        const stream = noteBodySource.pipe(
            switchMap(noteBody => noteItemSource, (noteBody, noteItem) => ({ noteItem, noteBody })),
            switchMap(({ noteItem, noteBody }) => this.saveNoteBody(noteItem, noteBody)),
            debounceTime(500),
            catchError((err) => {
                this._errors.next(err);
                return Observable.throw(err);
            })
        );

        const subscription = stream.subscribe(this.noteBodySaveStream);
        this.subscriptions.push(subscription);

        return subscription;
    }

    unsubscribe(subscription: Subscription) {
        const index = this.subscriptions.findIndex(s => s === subscription);

        if (index !== -1) {
            subscription.unsubscribe();
            this.subscriptions[index] = null;
            this.subscriptions.splice(index, 1);
        }
    }

    private findNoteFiles(): Observable<string[]> {
        return readdirAsObservable(this.noteStorePath);
    }

    private readNoteItem(fileName: string): Observable<NoteItem> {
        const metadataFileName = path.resolve(
            this.noteStorePath,
            fileName,
            'metadata.json'
        );

        return readFileAsObservable(metadataFileName, 'utf8').pipe(
            map<Buffer, NoteMetadata>((bufferData) => {
                const data = bufferData.toString('utf8');
                let metadata;

                try {
                    metadata = JSON.parse(data);
                    return metadata;
                } catch (err) {
                    return Observable.throw(err);
                }
            }),
            map<NoteMetadata, NoteItem>(metadata => new NoteItem(fileName, metadata)),
            catchError(() => Observable.of(null))
        );
    }

    private readNoteBody(note: NoteItem): Observable<NoteBody> {
        const noteItemPath = path.resolve(
            this.noteStorePath,
            note.fileName,
            'body.json'
        );

        return readFileAsObservable(noteItemPath, 'utf8').pipe(
            map<Buffer, NoteBodySnippet[]>((bufferData) => {
                const data = bufferData.toString('utf8');
                let snippets;

                try {
                    snippets = JSON.parse(data);
                    return snippets;
                } catch (err) {
                    return Observable.throw(err);
                }
            }),
            map<NoteBodySnippet[], NoteBody>(snippets => new NoteBody(snippets)),
            catchError(() => Observable.of(null))
        );
    }

    private saveNoteBody(note: NoteItem, noteBody: NoteBody): Observable<void> {
        const noteItemPath = path.resolve(
            this.noteStorePath,
            note.fileName,
            'body.json'
        );

        return writeFileAsObservable(noteItemPath, noteBody.toString(), 'utf8');
    }
}
