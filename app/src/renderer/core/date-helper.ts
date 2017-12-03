import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';


export enum DateUnit {
    MILLISECONDS,
    SECONDS,
    MINUTES,
    HOURS,
    DATE,
    MONTH,
    YEAR
}

export enum DateManipulateType {
    ADD,
    SUBTRACT
}

@Injectable()
export class DateHelper {
    static unitMethodMap = {
        [DateUnit.MILLISECONDS]: 'Milliseconds',
        [DateUnit.SECONDS]: 'Seconds',
        [DateUnit.MINUTES]: 'Minutes',
        [DateUnit.HOURS]: 'Hours',
        [DateUnit.DATE]: 'Date',
        [DateUnit.MONTH]: 'Month',
        [DateUnit.YEAR]: 'FullYear'
    };

    static unitAsMilliseconds = {
        [DateUnit.MILLISECONDS]: 1,
        [DateUnit.SECONDS]: 1000,
        [DateUnit.MINUTES]: 1000 * 60,
        [DateUnit.HOURS]: 1000 * 60 * 60,
        [DateUnit.DATE]: 1000 * 60 * 60 * 24,
    };

    constructor(private datePipe: DatePipe) {
    }

    copy(source: Date|string|number): Date {
        if (typeof source === 'string') {
            if (this.isValidDateStr(source)) {
                return new Date(source);
            } else {
                return null;
            }
        }

        if (typeof source === 'number') {
            return new Date(source);
        }

        if (source instanceof Date) {
            return new Date(source.toString());
        }

        return null;
    }

    now(): Date {
        return this.copy(Date.now());
    }

    isValidDateStr(dateStr: string): boolean {
        const date = Date.parse(dateStr);

        return !Number.isNaN(date);
    }

    format(date: Date, pattern: string): string {
        return this.datePipe.transform(date, pattern);
    }

    manipulate(date: Date, type: DateManipulateType, amount: number, unit: DateUnit) {
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
            default: return;
        }

        const originalValue: any = date[`get${methodName}`]();
        date[`set${methodName}`](originalValue + (dir * amount));
    }

    add(date: Date, amount: number, unit: DateUnit) {
        this.manipulate(date, DateManipulateType.ADD, amount, unit);
    }

    subtract(date: Date, amount: number, unit: DateUnit) {
        this.manipulate(date, DateManipulateType.SUBTRACT, amount, unit);
    }

    diff(source: Date, target: Date, unit: DateUnit = DateUnit.MILLISECONDS): number {
        const sourceTime = source.getTime();
        const targetTime = target.getTime();

        const diffAsMilliseconds = targetTime - sourceTime;

        return Math.floor(diffAsMilliseconds / DateHelper.unitAsMilliseconds[unit]);
    }

    isBeforeOrSame(source: Date, target: Date, unit: DateUnit = DateUnit.MILLISECONDS): boolean {
        return this.diff(source, target, unit) >= 0;
    }

    isAfterOrSame(source: Date, target: Date, unit: DateUnit = DateUnit.MILLISECONDS): boolean {
        return this.diff(source, target, unit) <= 0;
    }
}
