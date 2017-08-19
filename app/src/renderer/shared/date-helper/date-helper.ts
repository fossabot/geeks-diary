import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateHelperConfig } from './date-helper-config';


export enum DateManipulateType {
    ADD,
    SUBTRACT
}

@Injectable()
export class DateHelper {
    static units = ['seconds', 'minutes', 'hours', 'date', 'month', 'year'];
    static unitMethodMap = {
        seconds: 'Seconds',
        minutes: 'Minutes',
        hours: 'Hours',
        date: 'Date',
        month: 'Month',
        year: 'FullYear'
    };
    static unitAsMilliseconds = {
        seconds: 1000,
        minutes: 60000,
        hours: 3600000,
        date: 86400000
    };

    constructor(private datePipe: DatePipe, private config: DateHelperConfig) {
    }

    isValidDateStr(dateStr: string): boolean {
        const date = Date.parse(dateStr);

        return !Number.isNaN(date);
    }

    copy(source: Date | string | null): Date | null {
        if (typeof source === 'string') {
            if (this.isValidDateStr(source)) {
                return new Date(source);
            } else {
                return null;
            }
        }

        if (source instanceof Date) {
            return new Date(source.toString());
        }

        return null;
    }

    getFirstDateOfMonth(year: number, month: number): Date {
        return new Date(year, month, 1);
    }

    getLastDateOfMonth(year: number, month: number): Date {
        return new Date(year, month + 1, 0);
    }

    format(date: Date, pattern: string): string | null {
        return this.datePipe.transform(date, pattern);
    }

    manipulate(date: Date, type: DateManipulateType, amount: number, unit: string) {
        let dir = 1;
        const methodName = DateHelper.unitMethodMap[unit];

        if (!methodName) {
            return;
        }

        switch (type) {
            case DateManipulateType.ADD:
                dir = 1;
                break;
            case DateManipulateType.SUBTRACT:
                dir = -1;
                break;
        }

        const originValue: any = date[`get${methodName}`]();
        date[`set${methodName}`](originValue + (dir * amount));
    }

    add(date: Date, amount: number, unit: string) {
        this.manipulate(date, DateManipulateType.ADD, amount, unit);
    }

    subtract(date: Date, amount: number, unit: string) {
        this.manipulate(date, DateManipulateType.SUBTRACT, amount, unit);
    }

    unify(date: Date, unit: string) {
        const indexOfUnit = DateHelper.units.findIndex(u => u === unit);

        if (indexOfUnit === -1) {
            return;
        }

        const methodName = DateHelper.unitMethodMap[unit];

        for (let i = 0; i < indexOfUnit; i++) {
            date[`set${methodName}`](this.config.unify[unit]);
        }
    }

    diff(source: Date, target: Date, unit: string): number {
        const sourceTime = source.getTime();
        const targetTime = target.getTime();

        const diffAsMilliseconds = targetTime - sourceTime;

        return Math.floor(diffAsMilliseconds / DateHelper.unitAsMilliseconds[unit]);
    }
}
