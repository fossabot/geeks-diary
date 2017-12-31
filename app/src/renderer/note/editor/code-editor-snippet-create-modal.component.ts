import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalHost } from '../../core/modal/modal-host';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Modal } from '../../core/modal/modal';
import { Subscription } from 'rxjs/Subscription';
import { CodeLanguageService } from '../../code/language.service';
import { OptionItem } from '../../ui/autocomplete/option-item.directive';


@Component({
    selector: 'note-code-editor-snippet-create-modal',
    templateUrl: './code-editor-snippet-create-modal.component.html',
    styleUrls: ['./code-editor-snippet-create-modal.component.less']
})
export class NoteCodeEditorSnippetCreateModalComponent implements ModalHost, OnInit, OnDestroy, AfterViewInit {
    inputs = null;
    creationForm: FormGroup;
    languageSearchResult: OptionItem[] = [];

    private searchStreamSubscription: Subscription;

    @ViewChild('fileNameInput') fileNameInput: ElementRef;
    @ViewChild('languageInput') languageInput: ElementRef;

    constructor(private modal: Modal,
                private formBuilder: FormBuilder,
                private elementRef: ElementRef,
                private languageService: CodeLanguageService) {
        this.creationForm = this.formBuilder.group({
            fileName: ['', Validators.required],
            language: ['', Validators.required]
        }, { updateOn: 'submit' });
    }

    get fileNameControl(): FormControl {
        return <FormControl>this.creationForm.get('fileName');
    }

    get languageControl(): FormControl {
        return <FormControl>this.creationForm.get('language');
    }

    ngOnInit() {
        const searchQueries = this.languageControl.valueChanges;

        this.searchStreamSubscription = this.languageService
            .search(searchQueries)
            .subscribe((result) => {
                this.languageSearchResult = result.map(r => ({
                    id: r.id,
                    name: r.id,
                    value: r.id,
                    inputValue: r.id
                }));
            });
    }

    ngOnDestroy() {
        if (this.searchStreamSubscription) {
            this.searchStreamSubscription.unsubscribe();
        }
    }

    ngAfterViewInit() {
        setTimeout(() => this.elementRef.nativeElement.querySelector('#languageInput').focus());
    }

    resolve() {
        this.modal.close(this.creationForm.value);
    }

    close() {
        this.modal.close();
    }

    submit(event: Event) {
        event.preventDefault();

        if (this.creationForm.invalid) {
            this.handleFormError();
            return;
        }

        this.resolve();
    }

    @HostListener('document:keydown.esc')
    private handleEscape() {
        this.close();
    }

    private handleFormError() {
        if (this.creationForm.get('fileName').errors) {
            this.creationForm.get('fileName').markAsTouched();
            this.fileNameInput.nativeElement.focus();
        } else if (this.creationForm.get('language').errors) {
            this.creationForm.get('language').markAsTouched();
            this.languageInput.nativeElement.focus();
        }
    }
}
