import { Config } from './config';


export class ProdConfig implements Config {
    RUN_TARGET = 'production';
    isProduction = true;
    enableAot = true;
}
