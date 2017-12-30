import { Injectable } from '@angular/core';
import * as path from 'path';
import { environment } from '../../config/environment';
import { readFileAsObservable } from '../../common/utils/fs-helpers';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SearchModel } from '../../common/models/search-model';


const iconStorePath = path.resolve(environment.getAppPath(), 'app/assets/vendors/devicon/');

interface DevIconMap {
    name: string;
    tags: string[];
    versions: {
        svg: string[];
    };
}


export class CodeTechStack {
    readonly name: string;
    readonly iconFilePath: string;

    private tags: string[];

    static getIconFilePath(name: string, svgFiles: string[]): string {
        const iconType = ['original', 'plain', 'line', 'original-wordmark', 'plain-wordmark', 'line-wordmark'];
        let iconName;

        for (const type of iconType) {
            if (svgFiles.includes(type)) {
                iconName = `${name}-${type}`;
                break;
            }
        }

        return path.resolve(iconStorePath, name, `${iconName}.svg`);
    }

    constructor(iconMap: DevIconMap) {
        this.name = iconMap.name;
        this.tags = iconMap.tags;
        this.iconFilePath = CodeTechStack.getIconFilePath(this.name, iconMap.versions.svg);
    }

    isTagMatches(query: string): boolean {
        let matches = false;

        for (const tag of this.tags) {
            if (tag.match(query) !== null) {
                matches = true;
                break;
            }
        }

        return matches;
    }
}


@Injectable()
export class CodeTechStackService {
    private stackStream = new BehaviorSubject<CodeTechStack[]>([]);

    constructor() {
        this.loadIconMap();
    }

    get stacks(): Observable<CodeTechStack[]> {
        return this.stackStream.asObservable();
    }

    search(queries: Observable<string>): Observable<CodeTechStack[]> {
        return queries.pipe(
            distinctUntilChanged(),
            debounceTime(50),
            switchMap(() => this.stacks, (query, stacks) => ({ stacks, query })),
            map(({ stacks, query }) => this.rawSearch(stacks, query))
        )
    }

    private rawSearch(stacks: CodeTechStack[], query: string): CodeTechStack[] {
        return new SearchModel<CodeTechStack>()
            .setScoringStrategy(2, (stack, q) => stack.name.match(q) !== null)
            .setScoringStrategy(1, (stack, q) => stack.isTagMatches(q))
            .search(stacks, query);
    }

    private loadIconMap(): void {
        const iconMapFilePath = path.resolve(iconStorePath, 'devicon.json');

        readFileAsObservable(iconMapFilePath, 'utf8').pipe(
            map((buffer: Buffer) => {
                const strData = buffer.toString('utf8');

                try {
                    return JSON.parse(strData);
                } catch (err) {
                    return ErrorObservable.create(err);
                }
            }),
            tap((iconMap: DevIconMap[]) => {
                const stacks = iconMap.map(i => new CodeTechStack(i));
                this.stackStream.next(stacks);
            })
        ).subscribe();
    }
}
