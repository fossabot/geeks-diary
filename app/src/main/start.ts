import { app } from 'electron';

import { appDelegate } from './app-delegate';


process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception: ', error.toString());

    if (error.stack) {
        console.error(error.stack);
    }
});

app.once('ready', () => {
    appDelegate
        .init()
        .subscribe(() => {
            console.log('START! 😸');
            appDelegate.run();
        });
});
