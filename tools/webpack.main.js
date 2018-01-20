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
        // '7zip' library needs '.json' file resolve.
        // They seems to read 'package.json' file.
        extensions: ['.ts', '.js', '.json']
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
