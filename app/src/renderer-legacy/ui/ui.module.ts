import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DateHelper } from '../shared/date-helper';

import { ButtonComponent } from './button/button.component';
import { CalendarConfig } from './calendar/calendar-config';
import { CalendarTable, calendarTableFactory } from './calendar/calendar-table.factory';
import { IconComponent } from './icon/icon.component';
import { ToolbarComponent } from './toolbar/toolbar.component';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ButtonComponent,
        IconComponent,
        ToolbarComponent
    ],
    providers: [
        CalendarConfig,
        {
            provide: CalendarTable,
            useFactory: calendarTableFactory,
            deps: [DateHelper, CalendarConfig]
        }
    ],
    exports: [
        ButtonComponent,
        IconComponent,
        ToolbarComponent
    ]
})
export class UIModule {

}
