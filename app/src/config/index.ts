import { DevConfig } from './config.dev';
import { ProdConfig } from './config.prod';
import { Config } from './config';


export function loadConfig(): Config {
    const RUN_TARGET = process.env.RUN_TARGET;
    let config;

    switch (RUN_TARGET) {
        case 'production':
            config = new ProdConfig();
            break;
        case 'development':
        default:
            config = new DevConfig();
            break;
    }

    return config;
}
