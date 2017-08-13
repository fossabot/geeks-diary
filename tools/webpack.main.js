const { NoEmitOnErrorsPlugin } = require('webpack');
const paths = require('./paths');


const config = {
    devtool: 'source-map',
    entry: {
        main: paths.src('main/start.ts')
    },
    output: {
        path: paths.dist(),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                include: [paths.src()],
                exclude: [...paths.excludes()],
                options: {
                    configFileName: paths.app('tsconfig.json')
                }
            }
        ]
    },
    plugins: [
        new NoEmitOnErrorsPlugin()
    ],
    target: 'electron-main'
};

module.exports = config;
