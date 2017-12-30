import {
    AfterContentInit, Component, ContentChild, ContentChildren, ElementRef, HostBinding, OnDestroy, QueryList,
    Renderer2
} from '@angular/core';
import { combineLatest } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { InputDirective } from './input.directive';
import { FormErrorMessageComponent } from './form-error-message.component';
import { PrefixDirective } from './prefix.directive';
import { SuffixDirective } from './suffix.directive';


@Component({
    selector: 'ui-form-field',
    templateUrl: './form-field.component.html',
    styleUrls: ['./form-field.component.less']
})
export class FormFieldComponent implements AfterContentInit, OnDestroy {
    @ContentChild(InputDirective) private control: InputDirective;
    @ContentChildren(FormErrorMessageComponent) private errorMessageCompList: QueryList<FormErrorMessageComponent>;
    @ContentChild(PrefixDirective) private prefix: PrefixDirective;
    @ContentChild(SuffixDirective) private suffix: SuffixDirective;
    @HostBinding('class.error') private fieldErrorCaught = false;

    private statusChangeSubscription: Subscription;

    constructor(private elementRef: ElementRef,
                private renderer: Renderer2) {
    }

    ngAfterContentInit(): void {
        if (!this.control.ngControl) {
            throw new Error();
        }

        const statusChanges = this.control.ngControl.statusChanges;
        const parentForm = this.control.parentForm;

        if (parentForm) {
            statusChanges.pipe(combineLatest(parentForm.statusChanges));
        }

        if (this.prefix) {
            this.appendPrefix();
        }

        if (this.suffix) {
            this.appendSuffix();
        }

        this.statusChangeSubscription =
            statusChanges.subscribe(status => this.handleControlStatus(status));

        if (this.control.ngControl.dirty || this.control.ngControl.touched) {
            this.handleControlStatus(this.control.ngControl.status);
        }
    }

    ngOnDestroy(): void {
        if (this.statusChangeSubscription) {
            this.statusChangeSubscription.unsubscribe();
        }
    }

    private handleControlStatus(status: string): void {
        if (status === 'INVALID') {
            this.showError();
        } else if (status === 'VALID' || this.control.ngControl.untouched) {
            this.removeError();
        }
    }

    private showError(): void {
        const errorKeys = Object.keys(this.control.ngControl.errors);
        let firstErrorMessageFound = false;

        this.fieldErrorCaught = true;
        this.errorMessageCompList.forEach((comp) => {
            if (!firstErrorMessageFound && errorKeys.includes(comp.errorName)) {
                comp.show = true;
                firstErrorMessageFound = true;
            } else {
                comp.show = false;
            }
        });
    }

    private removeError(): void {
        this.fieldErrorCaught = false;
        this.errorMessageCompList.forEach((comp) => {
            comp.show = false;
        });
    }

    private appendPrefix(): void {
        const container = this.elementRef.nativeElement.querySelector('.FormField');
        const containerClientRect = container.getBoundingClientRect();
        const inputElemClientRect = this.control.elementRef.nativeElement.getBoundingClientRect();
        const prefixElemClientRect = this.prefix.elementRef.nativeElement.getBoundingClientRect();

        const left = containerClientRect.left - inputElemClientRect.left;
        const top = (inputElemClientRect.top - containerClientRect.top)
            + ((inputElemClientRect.height - prefixElemClientRect.height) / 2);

        const prefixElem = this.prefix.elementRef.nativeElement;
        const setStyle = this.renderer.setStyle;

        setStyle(prefixElem, 'position', 'absolute');
        setStyle(prefixElem, 'left', `${left}px`);
        setStyle(prefixElem, 'top', `${top}px`);
        this.control._paddingLeft = prefixElemClientRect.width;
    }

    private appendSuffix(): void {
        const container = this.elementRef.nativeElement.querySelector('.FormField');
        const containerClientRect = container.getBoundingClientRect();
        const inputElemClientRect = this.control.elementRef.nativeElement.getBoundingClientRect();
        const prefixElemClientRect = this.prefix.elementRef.nativeElement.getBoundingClientRect();

        const right = inputElemClientRect.right - containerClientRect.right;
        const top = (inputElemClientRect.top - containerClientRect.top)
            + ((inputElemClientRect.height - prefixElemClientRect.height) / 2);

        const suffixElem = this.suffix.elementRef.nativeElement;
        const setStyle = this.renderer.setStyle;

        setStyle(suffixElem, 'position', 'absolute');
        setStyle(suffixElem, 'right', `${right}px`);
        setStyle(suffixElem, 'top', `${top}px`);
        this.control._paddingRight = prefixElemClientRect.width;
    }
}
