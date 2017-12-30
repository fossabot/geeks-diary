import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NoteBody } from '../models';
import * as MarkdownIt from 'markdown-it';
const hljs = require('highlight.js');


const md = new MarkdownIt({
    highlight(str, lang): string {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>';
            } catch (__) {}
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});

@Component({
    selector: 'note-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class NotePreviewComponent {
    @Input() noteBody: NoteBody;

    constructor(private sanitizer: DomSanitizer) {
    }

    parseMarkdown(value: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(md.render(value));
    }

    parseCode(language: string, value: string): SafeHtml {
        const code = `\`\`\`${language}\n${value}\n\`\`\`\``;

        return this.sanitizer.bypassSecurityTrustHtml(md.render(code));
    }
}
