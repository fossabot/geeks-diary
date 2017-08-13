import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { RootModule } from './root/root.module';
import { loadConfig } from '../config';


const config = loadConfig();

if (config.isProduction) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(RootModule)
    .catch((err) => {
        console.error(err);
    });
