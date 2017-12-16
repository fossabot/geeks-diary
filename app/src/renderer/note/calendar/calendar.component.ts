import { Component, Inject, OnInit } from '@angular/core';
import { CALENDAR_TABLE_INJECTION_TOKEN, CalendarTable, DateCell } from '../../ui/calendar/calendar-table';
import { DateHelper, DateUnit } from '../../ui/date-helper';


type CalendarTableFactoryType = () => CalendarTable;


@Component({
    selector: 'note-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.less']
})
export class NoteCalendarComponent implements OnInit {
    calendarTable: CalendarTable;

    constructor(@Inject(CALENDAR_TABLE_INJECTION_TOKEN) private calendarFactory: CalendarTableFactoryType,
                private dateHelper: DateHelper) {
        this.calendarTable = this.calendarFactory();
    }

    ngOnInit(): void {
        const now = this.dateHelper.now();

        this.calendarTable.render(now.getFullYear(), now.getMonth());
        console.log(this.calendarTable);
    }

    navigateMonth(indent: number): void {
        const date = new Date();

        date.setFullYear(this.calendarTable.year);
        date.setMonth(this.calendarTable.month);

        if (indent > 0) {
            this.dateHelper.add(date, indent, DateUnit.MONTH);
        } else if (indent < 0) {
            this.dateHelper.subtract(date, indent * -1, DateUnit.MONTH);
        }

        this.calendarTable.render(date.getFullYear(), date.getMonth());
    }

    selectDateCell(dateCell: DateCell): void {
        if (dateCell.isBlank) {
            return;
        }

        console.log(dateCell.displayName);
    }
}
