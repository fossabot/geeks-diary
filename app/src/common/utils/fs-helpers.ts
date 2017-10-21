import * as fs from 'fs';
import { Observable } from 'rxjs/Observable';


export const readFileAsObservable = Observable.bindNodeCallback((
    filename: string,
    encoding: string,
    callback: (error: Error, buffer: Buffer) => void
) => fs.readFile(filename, encoding, callback));


export const readdirAsObservable = Observable.bindNodeCallback((
    dirname: string,
    callback: (error: Error, files: string[]) => void
) => fs.readdir(dirname, callback));


export const writeFileAsObservable = Observable.bindNodeCallback(fs.writeFile, () => null);
