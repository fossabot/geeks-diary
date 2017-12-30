import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import * as colors from './colors.json';
import { COLOR_WHITE } from '../../common/colors';


export class CodeLanguage {
    private _id: string;
    private _aliases: string[];
    private _color: string;

    static createFromMonaco(info: monaco.languages.ILanguageExtensionPoint): CodeLanguage {
        return new CodeLanguage(info.id, info.aliases);
    }

    constructor(id: string, aliases: string[]) {
        this._id = id;
        this._aliases = aliases;

        this.setColor();
    }

    get id(): string {
        return this._id;
    }

    get color(): string {
        return this._color;
    }

    isAliases(name: string): boolean {
        return this._aliases.includes(name);
    }

    getAliasesMatchScore(query: string): number {
        let score = 0;

        this._aliases.forEach((alias) => {
            if (alias.match(query)) {
                score++;
            }
        });

        return score;
    }

    private setColor() {
        const colorKeys = Object.keys(<any>colors);

        for (const name of colorKeys) {
            if (this.isAliases(name)) {
                this._color = (<any>colors)[name].color;

                if (this._color) {
                    break;
                }
            }
        }

        if (!this._color) {
            this._color = COLOR_WHITE;
        }
    }
}


@Injectable()
export class CodeLanguageService {
    private _languages: CodeLanguage[] = [];
    private languagesStream = new BehaviorSubject<CodeLanguage[]>(this._languages);

    constructor() {
        if ((<any>window).MONACO) {
            this.init();
        } else {
            (<any>window).REGISTER_MONACO_INIT_CALLBACK(() => this.init());
        }
    }

    get languages(): Observable<CodeLanguage[]> {
        return this.languagesStream.asObservable();
    }

    search(quires: Observable<string>): Observable<CodeLanguage[]> {
        return quires.pipe(
            distinctUntilChanged(),
            debounceTime(50),
            switchMap(() => this.languages, (query, languages) => ({ languages, query })),
            map(({ languages, query }) => {
                return this.rawSearch(languages, query);
            })
        );
    }

    private rawSearch(languages: CodeLanguage[], query: string): CodeLanguage[] {
        const result: any[] = [];

        for (const language of languages) {
            let score = 0;

            if (language.id.match(query)) {
                score += 3;
            }

            score += language.getAliasesMatchScore(query);

            if (score > 0) {
                result.push({ score, language });
            }
        }

        result.sort((a, b) => {
            if (a.score > b.score) {
                return -1;
            } else if (a.score < b.score) {
                return 1;
            }

            return 0;
        });

        return result
            .filter(r => r.language.id !== 'markdown')
            .map(r => r.language);
    }

    private init() {
        const languagesFromMonaco: monaco.languages.ILanguageExtensionPoint[] =
            (<any>window).MONACO.languages.getLanguages();

        this._languages =
            languagesFromMonaco.map(l => CodeLanguage.createFromMonaco(l));

        this.languagesStream.next(this._languages);
    }
}
