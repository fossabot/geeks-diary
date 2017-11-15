import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ModalHost } from '../../core/modal/modal-host';
import { Modal } from '../../core/modal/modal';
import { CodeLanguage, CodeLanguageService } from '../../code/code-language.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';


@Component({
    selector: 'app-note-code-editor-snippet-create-modal',
    templateUrl: './code-snippet-create-modal.component.html',
    styleUrls: ['./code-snippet-create-modal.component.less']
})
export class NoteCodeEditorSnippetCreateModalComponent implements OnInit, OnDestroy, AfterViewInit, ModalHost {
    inputs = null;
    creationForm: FormGroup;
    private searchStreamSubscription: Subscription;
    languageSearchResult: CodeLanguage[] = [];
    autocompletePanelOpened = false;

    constructor(private modal: Modal,
                private formBuilder: FormBuilder,
                private codeLanguageService: CodeLanguageService,
                private elementRef: ElementRef) {
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
        const searchQueries = this.creationForm.get('language').valueChanges;

        this.searchStreamSubscription = this.codeLanguageService.search(searchQueries)
            .subscribe((result) => {
                this.autocompletePanelOpened = true;
                this.languageSearchResult = result;
            });
    }

    ngOnDestroy() {
        if (this.searchStreamSubscription) {
            this.searchStreamSubscription.unsubscribe();
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.elementRef.nativeElement.querySelector('#fileName').focus();
        });
    }

    resolve() {
        this.modal.resolve(this.creationForm.value);
        this.modal.close();
    }

    close() {
        this.modal.close();
    }

    @HostListener('document:keydown.esc')
    escapeModal() {
        this.close();
    }

    submit(e: Event) {
        e.preventDefault();

        if (this.creationForm.invalid) {
            this.handleFormError();
            return;
        }

        this.resolve();
    }

    private handleFormError() {
        if (this.creationForm.get('fileName').errors) {
            this.creationForm.get('fileName').markAsTouched();
            this.elementRef.nativeElement.querySelector('#fileName').focus();
        } else if (this.creationForm.get('language').errors) {
            this.creationForm.get('language').markAsTouched();
            this.elementRef.nativeElement.querySelector('#fileLanguage').focus();
        }
    }
}
