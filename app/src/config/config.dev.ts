import { Config } from './config';


export class DevConfig implements Config {
    RUN_TARGET = 'development';
    isProduction = false;
    enableAot = false;
}
