import { Injectable } from '@angular/core';

import { DateHelper } from '../../shared/date-helper/date-helper';
import { CalendarConfig } from './calendar-config';


export class DateCell {
    date: Date | null = null;
    isBlank = false;
    diffWithToday: number;
    displayName: string;
    time: number;

    constructor(private dateHelper: DateHelper, date?: Date) {
        if (!date) {
            this.date = null;
            this.isBlank = true;
            return;
        }

        this.date = this.dateHelper.copy(date);
        this.diffWithToday = this.getDiffWithToday(this.date);
        this.displayName = this.dateHelper.format(this.date, 'y-MM-dd');
        this.time = this.date.valueOf();
    }

    getDiffWithToday(source: Date): number {
        const today = new Date(Date.now());
        const target = this.dateHelper.copy(source);

        this.dateHelper.unify(today, 'date');
        this.dateHelper.unify(target, 'date');

        return this.dateHelper.diff(today, target, 'date');
    }
}


export class WeekRow {
    cells: DateCell[] = [];
    isFirst = false;
    isLast = false;

    private addBlankDateCells(count: number) {
        for (let i = 0; i < count; i++) {
            this.cells.push(new DateCell(this.dateHelper));
        }
    }

    constructor(private dateHelper: DateHelper,
                indexDate: Date,
                beforeBlankCellsCount: number = 0,
                afterBlankCellsCount: number = 0) {
        this.addBlankDateCells(beforeBlankCellsCount);

        for (let i = 0; i < 7 - (beforeBlankCellsCount + afterBlankCellsCount); i++) {
            this.cells.push(new DateCell(this.dateHelper, indexDate));
            this.dateHelper.add(indexDate, 1, 'date');
        }

        this.addBlankDateCells(afterBlankCellsCount);
    }

    setAsFirstWeek() {
        this.isFirst = true;
    }

    setAsLastWeek() {
        this.isLast = true;
    }
}


@Injectable()
export class CalendarTable {
    rows: WeekRow[] = [];
    year: number;
    month: number;
    weeksCount: number;
    displayName: string;

    private makeMetadata() {
        this.weeksCount = this.rows.length;
        this.displayName = this.dateHelper.format(
            this.dateHelper.getFirstDateOfMonth(this.year, this.month),
            this.config.monthDisplayPattern
        );
    }

    constructor(private dateHelper: DateHelper,
                private config: CalendarConfig) {
    }

    setYear(year: number): CalendarTable {
        this.year = year;
        return this;
    }

    setMonth(month: number): CalendarTable {
        this.month = month;
        return this;
    }

    render() {
        this.rows = []; // Remove all rows before render.

        const firstDate = this.dateHelper.getFirstDateOfMonth(this.year, this.month);
        const dayOfFirstDate = firstDate.getDay();
        const maxDays = this.dateHelper
            .getLastDateOfMonth(this.year, this.month)
            .getDate();

        const firstRowCellsCount = 7 - dayOfFirstDate;
        const middleRowsCount = Math.floor((maxDays - firstRowCellsCount) / 7);
        const lastRowCellsCount = maxDays - (firstRowCellsCount + (middleRowsCount * 7));

        const indexDate = firstDate;

        let weekRow;

        weekRow = new WeekRow(this.dateHelper, indexDate, dayOfFirstDate);
        weekRow.setAsFirstWeek();
        this.rows.push(weekRow);

        for (let i = 0; i < middleRowsCount; i += 1) {
            weekRow = new WeekRow(this.dateHelper, indexDate);
            this.rows.push(weekRow);
        }

        if (lastRowCellsCount > 0) {
            weekRow = new WeekRow(this.dateHelper, indexDate, 0, 7 - lastRowCellsCount);
            this.rows.push(weekRow);
        }

        // Make last row as last week
        const lastRow = this.rows[this.rows.length - 1];
        lastRow.setAsLastWeek();

        this.makeMetadata();
    }
}


export function calendarTableFactory(dateHelper: DateHelper,
                                     config: CalendarConfig) {
    return () => new CalendarTable(dateHelper, config);
}
