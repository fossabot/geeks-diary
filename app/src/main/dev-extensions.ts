import { app } from 'electron';
import { environment } from '../config/environment';


if (!environment.config.isProduction) {
    const installExtension = require('electron-devtools-installer').default;
    const extensions = [
        { name: 'Redux DevTools', id: 'lmhkpmbekcpmknklioeibfkpmmfibljd' }
    ];

    app.once('ready', () => {
        const userDataPath = environment.getPath('userData');

        extensions.forEach((extension) => {
            installExtension(extension.id).then(() => {
                console.log(extension.name + ' installed in ' + userDataPath);
            }).catch(err => {
                console.error('Failed to install ' + extension.name, err);
            });
        });
    });
}
