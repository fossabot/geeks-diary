import { Injectable } from '@angular/core';


@Injectable()
export class DateHelperConfigService {
    unify = {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        date: 1,
        hours: 0,
        minutes: 0,
        seconds: 0
    };
}
