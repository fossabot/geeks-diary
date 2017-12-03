/// <reference path="../../assets/vendors/monaco-editor/monaco.d.ts" />
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { RootModule } from './root.module';
import { environment } from '../config/environment';


if (environment.config.isProduction) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(RootModule)
    .catch((err) => {
        console.error(err);
    });