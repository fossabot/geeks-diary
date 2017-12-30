import { Directive, ElementRef } from '@angular/core';


@Directive({
    selector: '[uiPrefix]'
})
export class PrefixDirective {
    constructor(public elementRef: ElementRef) {
    }
}
