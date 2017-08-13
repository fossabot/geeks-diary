import { app, BrowserWindow } from 'electron';
import * as url from 'url';

import { loadConfig } from '../config';


let win;
const config = loadConfig();

const createWindow = () => {
    const filename = config.enableAot ? 'app-aot.html' : 'app.html';

    win = new BrowserWindow({
        width: 768,
        height: 600,
        minWidth: 600,
        minHeight: 480
    });

    win.loadURL(url.format({
        protocol: 'file',
        pathname: `${process.cwd()}/app/${filename}`,
        slashes: true
    }));
};

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception: ', error.toString());

    if (error.stack) {
        console.error(error.stack);
    }
});

app.once('ready', () => {
    console.log('START! 😸');
    createWindow();
});

app.addListener('activate', (event, hasVisibleWindows) => {
    if (!hasVisibleWindows) {
        createWindow();
    }
});

app.addListener('window-all-closed', () => {
    if (process.platform in ['win32', 'linux']) {
        app.quit();
    }
});
