import { DevConfig } from './config.dev';
import { ProdConfig } from './config.prod';
import { Config } from './config';


let app;

declare var process: any;

const requireModule = () => {
    if (process.type === 'renderer') {
        app = require('electron').remote.app;
    } else {
        app = require('electron').app;
    }
};


class Environment {
    config: Config;

    setConfig(config: Config) {
        this.config = config;
    }

    getPath(name: string): string {
        if (!app) {
            requireModule();
        }

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
