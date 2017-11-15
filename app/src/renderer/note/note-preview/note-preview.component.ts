import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NotePrettierService } from './note-prettier.service';
import { SafeHtml } from '@angular/platform-browser';


@Component({
    selector: 'app-note-preview',
    templateUrl: './note-preview.component.html',
    styleUrls: ['./note-preview.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotePreviewComponent implements OnInit, OnChanges, OnDestroy {
    @Input() content = '';
    prettierContent: SafeHtml;

    constructor(private notePrettier: NotePrettierService) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!!changes.content) {
            this.prettierContent = this.notePrettier.render(this.content);
        }
    }

    ngOnDestroy() {
    }

}
