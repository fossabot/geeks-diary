import { InjectionToken } from '@angular/core';
import { DateHelper, DateUnit } from '../date-helper';
import { isNumber } from '../../../common/utils/is-number';


export class DateCell {
    private date: Date = null;

    constructor(date: Date, private dateHelper: DateHelper) {
        if (date) {
            this.date = this.dateHelper.copy(date);
        }
    }

    get isBlank(): boolean {
        return this.date === null;
    }

    get displayName(): string {
        if (this.isBlank) {
            return '';
        }

        return this.dateHelper.format(this.date, 'y-MM-dd');
    }

    get time(): number {
        if (this.isBlank) {
            return NaN;
        }

        return this.date.valueOf();
    }
}


export class WeekRow {
    cells: DateCell[] = [];

    constructor(index: Date,
                beforeBlankCellCount: number,
                afterBlankCellCount: number,
                private dateHelper: DateHelper) {
        this.addBlankCell(beforeBlankCellCount);

        for (let i = 0; i < 7 - (beforeBlankCellCount + afterBlankCellCount); i++) {
            this.cells.push(new DateCell(index, this.dateHelper));
            this.dateHelper.add(index, 1, DateUnit.DATE);
        }

        this.addBlankCell(afterBlankCellCount);
    }

    private addBlankCell(count: number): void {
        for (let i = 0; i < count; i++) {
            this.cells.push(new DateCell(null, this.dateHelper));
        }
    }
}


export class CalendarTable {
    rows: WeekRow[] = [];

    private _year: number;
    private _month: number;

    constructor(private dateHelper: DateHelper) {
    }

    get year(): number {
        return this._year;
    }

    get month(): number {
        return this._month;
    }

    get displayName(): string {
        if (!isNumber(this.year) || !isNumber(this.month)) {
            return '';
        }

        return this.dateHelper.format(
            this.dateHelper.getFirstDateOfMonth(this.year, this.month),
            'MMM y'
        );
    }

    render(year: number, month: number): void {
        this.rows = [];

        this._year = year;
        this._month = month;

        const firstDate = this.dateHelper.getFirstDateOfMonth(year, month);
        const dayOfFirstDate = firstDate.getDay();
        const maxDays = this.dateHelper
            .getLastDateOfMonth(year, month)
            .getDate();

        const firstRowCellsCount = 7 - dayOfFirstDate;
        const middleRowsCount = Math.floor((maxDays - firstRowCellsCount) / 7);
        const lastRowCellsCount = maxDays - (firstRowCellsCount + (middleRowsCount * 7));

        const indexDate = firstDate;

        let weekRow;

        weekRow = new WeekRow(indexDate, dayOfFirstDate, 0, this.dateHelper);
        this.rows.push(weekRow);

        for (let i = 0; i < middleRowsCount; i += 1) {
            weekRow = new WeekRow(indexDate, 0, 0, this.dateHelper);
            this.rows.push(weekRow);
        }

        if (lastRowCellsCount > 0) {
            weekRow = new WeekRow(indexDate, 0, 7 - lastRowCellsCount, this.dateHelper);
            this.rows.push(weekRow);
        }
    }
}


export const CALENDAR_TABLE_INJECTION_TOKEN = new InjectionToken('CalendarTable');

// noinspection JSUnusedGlobalSymbols
export const CALENDAR_TABLE_PROVIDER = {
    provide: CALENDAR_TABLE_INJECTION_TOKEN,
    useFactory(dateHelper: DateHelper) {
        return () => new CalendarTable(dateHelper);
    },
    deps: [DateHelper]
};
