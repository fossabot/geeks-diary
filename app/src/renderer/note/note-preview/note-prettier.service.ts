import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as Remarkable from 'remarkable';
import * as hljs from 'highlight.js';


const md = new Remarkable({
    html: true,
    xhtmlOut: false,
    breaks: true,
    langPrefix: 'language-',
    linkify: true,
    highlight(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (err) {
                console.error(err);
            }
        }

        try {
            return hljs.highlightAuto(str).value;
        } catch (err) {
            console.error(err);
        }

        return '';
    }
});


@Injectable()
export class NotePrettierService {
    constructor(private sanitizer: DomSanitizer) {
    }

    render(content: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(
            md.render(content)
        );
    }
}
