import { Component, OnDestroy, OnInit } from '@angular/core';
import { CodeTechStack, CodeTechStackService } from '../tech-stack.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { OptionItem } from '../../ui/autocomplete/option-item.directive';


interface TechStackOptionItem extends OptionItem {
    value: CodeTechStack;
}


@Component({
    selector: 'code-tech-stack-input',
    templateUrl: './tech-stack-input.component.html',
    styleUrls: ['./tech-stack-input.component.less']
})
export class CodeTechStackInputComponent implements OnInit, OnDestroy {
    stacks: CodeTechStack[] = [];
    stackFormControl = new FormControl('');
    stackSearchResult: TechStackOptionItem[] = [];

    private searchStreamSubscription: Subscription;

    constructor(private techStackService: CodeTechStackService) {
    }

    ngOnInit(): void {
        this.searchStreamSubscription = this.techStackService
            .search(this.stackFormControl.valueChanges)
            .subscribe((result) => {
                this.stackSearchResult = this.parseStackSearchResultAsOptionItem(result);
            });
    }

    ngOnDestroy(): void {
        if (this.searchStreamSubscription) {
            this.searchStreamSubscription.unsubscribe();
        }
    }

    selectStack(option: OptionItem): void {
        this.stackFormControl.patchValue('');
        this.stacks.push(option.value);
    }

    removeStack(stack: CodeTechStack): void {
        const index = this.stacks.findIndex(s => s.name === stack.name);

        if (index !== -1) {
            this.stacks.splice(index, 1);
        }
    }

    private parseStackSearchResultAsOptionItem(result: CodeTechStack[]): TechStackOptionItem[] {
        const filtered = result.filter(stack => this.stacks.findIndex(s => s.name === stack.name) === -1);

        return filtered.map((r) => ({
            id: r.name,
            name: r.name,
            value: r,
            inputValue: r.name
        }));
    }
}
