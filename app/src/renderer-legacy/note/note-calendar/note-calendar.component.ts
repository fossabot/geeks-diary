import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';

import { DateHelper, DateUnit } from '../../shared/date-helper';
import { CalendarTable } from '../../ui/calendar/calendar-table.factory';


@Component({
    selector: 'app-note-calendar',
    templateUrl: './note-calendar.component.html',
    styleUrls: ['./note-calendar.component.less']
})
export class NoteCalendarComponent implements OnInit {
    @Output() select = new EventEmitter<Date>();
    calendarTable: CalendarTable;

    constructor(private dateHelper: DateHelper,
                @Inject(CalendarTable) private calendarTableFactory: () => CalendarTable) {
        this.calendarTable = calendarTableFactory();
    }

    ngOnInit() {
        const now = new Date();

        this.calendarTable
            .setYear(now.getFullYear())
            .setMonth(now.getMonth())
            .render();
    }

    navigateMonth(direction: number) {
        const date = new Date();

        date.setFullYear(this.calendarTable.year);
        date.setMonth(this.calendarTable.month);

        if (direction > 0) {
            this.dateHelper.add(date, direction, DateUnit.MONTH);
        } else if (direction < 0) {
            this.dateHelper.subtract(date, direction * -1, DateUnit.MONTH);
        }

        this.calendarTable
            .setYear(date.getFullYear())
            .setMonth(date.getMonth())
            .render();
    }
}