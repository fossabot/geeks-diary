import { Component, Input } from '@angular/core';


@Component({
    selector: 'ui-form-error-message',
    templateUrl: './form-error-message.component.html',
    styleUrls: ['./form-error-message.component.less']
})
export class FormErrorMessageComponent {
    @Input() errorName: string;
    show = false;
}
