import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import * as path from 'path';

import { environment } from '../../config/environment';
import { readdirAsObservable, readFileAsObservable, writeFileAsObservable } from '../../common/utils/fs-helpers';
import { DateHelper } from '../shared/date-helper';


export interface NoteItem {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt?: Date;
    fileName: string;
    status?: string;
}

export interface NoteMetadata {
    id: string;
    title: string;
    createdAt: string;
    updatedAt?: string;
}

export interface NoteBody {
    content: string;
}


@Injectable()
export class NoteStoreService {
    private noteStorePath = path.resolve(environment.getPath('userData'), 'notes/');

    private noteItemsStream = new BehaviorSubject<NoteItem[]>([]);
    private noteItemsStreamSubscriptions: Subscription[] = [];

    private noteItemSelectionStream = new BehaviorSubject<NoteItem>(null);
    private noteItemSelectionStreamSubscriptions: Subscription[] = [];

    private noteBodyStream = new Subject<NoteBody>();
    private noteBodyStreamSubscriptions: Subscription[] = [];

    constructor(private dateHelper: DateHelper) {
        this.pullNoteItems();
    }

    pullNoteItems() {
        const instanceObservable = Observable.create((observer) => {
            observer.next();
            observer.complete();
        });

        this.registerReadAllNoteItemsSource(instanceObservable);
    }

    registerReadAllNoteItemsSource(source: Observable<any>): Subscription {
        const stream = source
            .switchMap(() => this.findNoteFiles())
            .switchMap((noteFiles) => {
                const tasks = [];

                noteFiles.forEach(fileName => tasks.push(
                    this.readNoteItem(fileName)
                ));

                return Observable.combineLatest(tasks);
            });

        const subscription = stream.subscribe(this.noteItemsStream);
        this.noteItemsStreamSubscriptions.push(subscription);

        return subscription;
    }

    registerReadNoteBodySource(source: Observable<NoteItem>): Subscription {
        const stream = source
            .switchMap(noteItem => this.readNoteBody(noteItem));

        const subscription = stream.subscribe(this.noteBodyStream);
        this.noteBodyStreamSubscriptions.push(subscription);

        return subscription;
    }

    registerSelectNoteItemSource(source: Observable<NoteItem>): Subscription {
        const subscription = source
            .distinctUntilChanged()
            .subscribe((noteItemSelection) => {
                this.noteItemSelectionStream.next(noteItemSelection);
            });

        this.noteItemSelectionStreamSubscriptions.push(subscription);

        return subscription;
    }

    registerSaveNoteBodySource(source: Observable<[NoteItem, string]>) {
        const subscription = source
            .switchMap(([noteItem, rawBody]) => this.writeNoteBody(noteItem, rawBody))
            .subscribe();

        this.noteBodyStreamSubscriptions.push(subscription);

        return subscription;
    }

    destroy() {
        this.noteItemsStreamSubscriptions.forEach((subscription) => {
            if (!subscription.closed) {
                subscription.unsubscribe();
            }
        });

        this.noteBodyStreamSubscriptions.forEach((subscription) => {
            if (!subscription.closed) {
                subscription.unsubscribe();
            }
        });

        this.noteItemSelectionStreamSubscriptions.forEach((subscription) => {
            if (!subscription.closed) {
                subscription.unsubscribe();
            }
        });

        this.noteItemsStreamSubscriptions = [];
        this.noteBodyStreamSubscriptions = [];
        this.noteItemSelectionStreamSubscriptions = [];
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

    private findNoteFiles(): Observable<string[]> {
        return readdirAsObservable(this.noteStorePath);
    }

    private parseNoteMetadata(fileName: string): Observable<NoteMetadata> {
        const metadataFileName = path.resolve(
            this.noteStorePath,
            fileName,
            'metadata.json'
        );

        return readFileAsObservable(metadataFileName, 'utf8')
            .map((bufferData) => {
                const data = bufferData.toString('utf8');
                let metadata;

                try {
                    metadata = JSON.parse(data);
                    return metadata;
                } catch (err) {
                    return Observable.throw(err);
                }
            })
            .catch(() => Observable.empty());
    }

    private readNoteItem(fileName: string): Observable<NoteItem> {
        return this.parseNoteMetadata(fileName)
            .map((metadata) => {
                const noteItem: NoteItem = {
                    id: metadata.id,
                    title: metadata.title,
                    createdAt: this.dateHelper.copy(metadata.createdAt),
                    fileName
                };

                if (metadata.updatedAt) {
                    noteItem.updatedAt = this.dateHelper.copy(metadata.updatedAt);
                }

                return noteItem;
            });
    }

    private readNoteBody(note: NoteItem): Observable<NoteBody> {
        const noteItemPath = path.resolve(
            this.noteStorePath,
            note.fileName,
            'body.md'
        );

        return readFileAsObservable(noteItemPath, 'utf8')
            .map(bufferData => ({
                content: bufferData.toString('utf8')
            }));
    }

    private writeNoteBody(note: NoteItem, rawBody: string): Observable<void> {
        const noteItemPath = path.resolve(
            this.noteStorePath,
            note.fileName,
            'body.json'
        );

        return writeFileAsObservable(noteItemPath, rawBody);
    }

}
