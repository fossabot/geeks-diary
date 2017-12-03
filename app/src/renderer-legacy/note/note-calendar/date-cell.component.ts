import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { DateCell } from '../../ui/calendar/calendar-table.factory';
import { ClassName } from '../../../common/utils/class-name';


@Component({
    selector: 'app-note-calendar-date-cell',
    templateUrl: './date-cell.component.html',
    styleUrls: ['./date-cell.component.less']
})
export class NoteCalendarDateCellComponent implements OnInit, OnChanges {
    @Input() dateCell: DateCell;
    @Output() select = new EventEmitter<DateCell>();
    cn = new ClassName('NoteCalendarDateCell');

    ngOnInit() {
        this.parseClassName();
    }

    ngOnChanges() {
        this.parseClassName();
    }

    selectDateCell() {
        if (this.dateCell.isBlank) {
            return;
        }

        this.select.emit(this.dateCell);
    }

    private parseClassName() {
        if (this.dateCell) {}
        this.cn.setModifier('blank', this.dateCell.isBlank ? 'enable' : 'disable');
    }
}
