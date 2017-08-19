import { Component, OnInit, Inject } from '@angular/core';

import { CalendarTable } from '../../ui/calendar/calendar-table.factory';


@Component({
    selector: 'app-note-calendar',
    templateUrl: './note-calendar.component.html',
    styleUrls: ['./note-calendar.component.less']
})
export class NoteCalendarComponent implements OnInit {
    calendarTable: CalendarTable;

    constructor(@Inject(CalendarTable) private calendarTableFactory: () => CalendarTable) {
        this.calendarTable = calendarTableFactory();
    }

    ngOnInit() {
        this.calendarTable
            .setYear(2017)
            .setMonth(7)
            .render();

        console.log(this.calendarTable);
    }
}
