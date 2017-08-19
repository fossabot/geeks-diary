import { Component, Input, OnChanges } from '@angular/core';

import { DateCell } from '../../ui/calendar/calendar-table.factory';
import { ClassName } from '../../../common/utils/class-name';


@Component({
    selector: 'app-note-calendar-date-cell',
    templateUrl: './note-calendar-date-cell.component.html',
    styleUrls: ['./note-calendar-date-cell.component.less']
})
export class NoteCalendarDateCellComponent implements OnChanges {
    @Input() dateCell: DateCell;
    cn = new ClassName('NoteCalendarDateCell');

    private parseClassName() {
        if (this.dateCell) {
            this.cn.setModifier('blank', this.dateCell.isBlank ? 'enable' : 'disable');
        }
    }

    ngOnChanges() {
        this.parseClassName();
    }
}
