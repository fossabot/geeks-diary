import { DevConfig } from './config.dev';
import { ProdConfig } from './config.prod';
import { Config } from './config';
import { isRendererProcess } from '../common/utils/is-renderer-process';


let app;

class Environment {
    config: Config;

    constructor() {
        if (isRendererProcess()) {
            app = require('electron').remote.app;
        } else {
            app = require('electron').app;
        }
    }

    setConfig(config: Config) {
        this.config = config;
    }

    // noinspection JSMethodCanBeStatic
    getPath(name: string): string {
        return app.getPath(name);
    }
}

export const environment = new Environment();

switch (process.env.RUN_TARGET) {
    case 'production':
        environment.setConfig(new ProdConfig());
        break;
    case 'development':
    default:
        environment.setConfig(new DevConfig());
        break;
}
