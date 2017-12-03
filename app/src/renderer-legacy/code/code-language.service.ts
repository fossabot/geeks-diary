import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as colors from './colors.json';


export class CodeLanguage {
    private _id: string;
    private _aliases: string[];
    private _color: string;

    constructor(info: monaco.languages.ILanguageExtensionPoint) {
        this._id = info.id;
        this._aliases = info.aliases;
    }

    get id(): string {
        return this._id;
    }

    get color(): string {
        return this._color;
    }

    get aliases(): string[] {
        return this._aliases;
    }

    isAliases(name: string): boolean {
        return this._aliases.includes(name);
    }

    setColor(color: string) {
        this._color = color;
    }
}


@Injectable()
export class CodeLanguageService {
    private colorKeys = Object.keys((<any>colors));
    private _languages: CodeLanguage[];
    private languagesStream = new BehaviorSubject<CodeLanguage[]>([]);

    constructor() {
        if ((<any>window).MONACO) {
            this.init();
        } else {
            (<any>window).REGISTER_MONACO_INIT_CALLBACK(() => {
                this.init();
            });
        }
    }

    get languages(): Observable<CodeLanguage[]> {
        return this.languagesStream.asObservable();
    }

    getLanguageColor(language: CodeLanguage): string {
        for (const name of this.colorKeys) {
            if (language.isAliases(name)) {
                const color = (<any>colors)[name].color;

                if (color) {
                    return color;
                }
            }
        }

        return '#ffffff';
    }

    getLanguageColorById(id: string): string {
        const language = this._languages.find(l => l.id === id);

        if (language) {
            return this.getLanguageColor(language);
        }

        return '#ffffff';
    }

    search(queries: Observable<string>): Observable<CodeLanguage[]> {
        return queries
            .distinctUntilChanged()
            .debounceTime(50)
            .switchMap(query => this.languages, (query, languages) => ({ languages, query }))
            .map(({ languages, query }) => {
                return this.rawSearch(languages, query);
            });
    }

    private rawSearch(languages: CodeLanguage[], query: string): CodeLanguage[] {
        const result: any[] = [];

        for (const language of languages) {
            let score = 0;

            if (language.id.match(query)) {
                score += 3;
            }

            language.aliases.forEach((alias) => {
                if (alias.match(query)) {
                    score += 1;
                }
            });

            if (score > 0) {
                result.push({ score, language });
            }
        }

        result.sort((a, b) => {
            if (a.score > b.score) {
                return -1;
            } else if (a.score > b.score) {
                return 1;
            }

            return 0;
        });

        return result.filter(r => r.language.id !== 'markdown').map(r => r.language);
    }

    private init() {
        const languages: monaco.languages.ILanguageExtensionPoint[] =
            (<any>window).MONACO.languages.getLanguages();

        this._languages = languages.map(l => new CodeLanguage(l));
        this._languages.forEach((language) => {
            language.setColor(this.getLanguageColor(language));
        });

        this.languagesStream.next(this._languages);
    }
}
