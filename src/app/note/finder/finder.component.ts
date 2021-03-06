import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, mergeMap, take } from 'rxjs/operators';
import { datetime, DateUnits } from '../../../common/datetime';
import {
    AddNoteAction,
    ChangeDateFilterAction,
    GetNoteCollectionAction,
    SelectNoteAction,
} from '../actions';
import { NoteContributeTable } from '../calendar/calendar.component';
import { NoteFinderDateFilterTypes, NoteMetadata } from '../models';
import { NoteFinderState, NoteStateWithRoot } from '../reducers';
import { NoteCollectionSortingMenu } from '../shared/note-collection-sorting.menu';
import { NoteFsService } from '../shared/note-fs.service';
import { NoteProduceService } from '../shared/note-produce.service';


@Component({
    selector: 'gd-note-finder',
    templateUrl: './finder.component.html',
    styleUrls: ['./finder.component.less'],
})
export class NoteFinderComponent implements OnInit {
    indexDate: Date;
    selectedDate: Date | null = null;
    notes: Observable<NoteMetadata[]>;
    selectedNote: Observable<NoteMetadata>;
    contributeTable: NoteContributeTable;

    constructor(
        private store: Store<NoteStateWithRoot>,
        private noteFsService: NoteFsService,
        private noteProduceService: NoteProduceService,
        private sortingMenu: NoteCollectionSortingMenu,
        private changeDetector: ChangeDetectorRef,
    ) {
    }

    ngOnInit(): void {
        this.notes = this.filteredNotes;
        this.selectedNote = this.store.pipe(
            select(state => state.note.collection.selectedNote),
        );

        this.indexDate = datetime.today();
        this.store.dispatch(new GetNoteCollectionAction());
    }

    updateIndexDate(distDate: Date): void {
        this.indexDate = datetime.copy(distDate);
        this.dispatchMonthFilterChanges();
    }

    selectDateFilter(selectedDate: Date | null): void {
        // If date is deselected, apply month filter.
        if (!selectedDate) {
            this.selectedDate = null;
            this.dispatchMonthFilterChanges();
            return;
        }

        this.selectedDate = datetime.copy(selectedDate);
        this.dispatchDateFilterChanges();
    }

    selectNote(note: NoteMetadata): void {
        this.store
            .pipe(
                select(state => state.note.collection.selectedNote),
                take(1),
            )
            .subscribe((selectedNote) => {
                if (selectedNote && selectedNote.id === note.id) {
                    return;
                }

                this.store.dispatch(new SelectNoteAction({
                    selectedNote: note,
                }));
            });
    }

    addNewNote(): void {
        const action = new AddNoteAction(this.noteProduceService.createNewNote());

        this.store.dispatch(action);
    }

    openSortMenu(): void {
        this.sortingMenu.open();
    }

    private dispatchMonthFilterChanges(): void {
        this.store.dispatch(new ChangeDateFilterAction({
            dateFilter: datetime.copy(this.indexDate),
            dateFilterBy: NoteFinderDateFilterTypes.MONTH,
        }));
    }

    private dispatchDateFilterChanges(): void {
        this.store.dispatch(new ChangeDateFilterAction({
            dateFilter: datetime.copy(this.selectedDate),
            dateFilterBy: NoteFinderDateFilterTypes.DATE,
        }));
    }

    private get filteredNotes(): Observable<NoteMetadata[]> {
        return this.store.pipe(
            select(state => state.note.collection.notes),
            mergeMap<NoteMetadata[], [NoteMetadata[], NoteFinderState]>(
                notes => this.store.pipe(
                    select(state => state.note.finder),
                    map(finderState => ([notes, finderState])),
                ),
            ),
            map(([notes, finderState]) => {
                this.makeContributeTable(notes);

                const filteredNotes = NoteMetadata.filterByDate(
                    notes,
                    finderState.dateFilter,
                    finderState.dateFilterBy,
                );

                NoteMetadata.sort(
                    filteredNotes,
                    finderState.sortBy,
                    finderState.sortDirection,
                );

                return filteredNotes;
            }),
        );
    }

    private makeContributeTable(notes: NoteMetadata[]): void {
        const index = datetime.getFirstDateOfMonth(
            this.indexDate.getFullYear(), this.indexDate.getMonth());

        const maxDays = datetime
            .getLastDateOfMonth(
                this.indexDate.getFullYear(), this.indexDate.getMonth())
            .getDate();

        this.contributeTable = {
            indexDate: datetime.copy(this.indexDate),
            map: {},
        };

        for (let i = 0; i < maxDays; i++) {
            const dateId = datetime.shortFormat(index);

            this.contributeTable.map[dateId] = notes
                .filter(note => datetime.isSameDay(
                    new Date(note.createdDatetime), index))
                .length;

            datetime.add(index, DateUnits.DAY, 1);
        }

        // Forcing change detection.
        this.changeDetector.detectChanges();
    }
}
