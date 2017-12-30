import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CodeTechStack } from '../tech-stack.service';


@Component({
    selector: 'code-tech-stack-item',
    templateUrl: './tech-stack-item.component.html',
    styleUrls: ['./tech-stack-item.component.less']
})
export class CodeTechStackItemComponent {
    @Input() codeTechStack: CodeTechStack;
    @Input() noBorder = false;
    @Input() noBackground = false;
    @Input() canDiscardOnHover = false;
    @Output() discard = new EventEmitter<CodeTechStack>();

    constructor(private sanitizer: DomSanitizer) {
    }

    get iconFilePath(): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.codeTechStack.iconFilePath);
    }

    discardThis(): void {
        this.discard.emit(this.codeTechStack);
    }
}
