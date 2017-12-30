import { Directive, ElementRef } from '@angular/core';


@Directive({
    selector: '[uiSuffix]'
})
export class SuffixDirective {
    constructor(public elementRef: ElementRef) {
    }
}
