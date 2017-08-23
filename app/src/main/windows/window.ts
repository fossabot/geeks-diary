import { BrowserWindow } from 'electron';
import * as path from 'path';
import * as EventEmitter from 'events';
import * as url from 'url';

import { environment } from '../../config/environment';


export class Window extends EventEmitter {
    private browserWindow: Electron.BrowserWindow;
    options: Electron.BrowserWindowConstructorOptions;
    templateUrl: string;

    constructor(templateName: string, options: Electron.BrowserWindowConstructorOptions) {
        super();

        this.templateUrl = environment.config.enableAot
            ? `${templateName}-aot.html`
            : `${templateName}.html`;

        this.options = options;
        this.browserWindow = new BrowserWindow(this.options);
    }

    handleEvents(): Window {
        this.browserWindow.on('closed', () => {
            this.emit('closed');
        });

        return this;
    }

    open(): Window {
        const filename = url.format({
            protocol: 'file',
            pathname: path.resolve(process.cwd(), 'app/', this.templateUrl),
            slashes: true
        });

        this.browserWindow.loadURL(filename);

        return this;
    }
}
