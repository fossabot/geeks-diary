const { NoEmitOnErrorsPlugin } = require('webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const { AotPlugin } = require('@ngtools/webpack');
const paths = require('./paths');


const config = {
    entry: {
        'vendor-aot': paths.src('renderer/vendor-aot.ts'),
        'boot-app-aot': paths.src('renderer/boot-app.ts')
    },
    output: {
        path: paths.dist('aot/'),
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [paths.nodeModules()]
    },
    resolveLoader: {
        modules: [paths.nodeModules()]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: '@ngtools/webpack'
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                query: {
                    minimize: false
                }
            },
            {
                test: /\.less$/,
                use: [
                    'exports-loader?module.exports.toString()',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss'
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: false
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new NoEmitOnErrorsPlugin(),
        new CommonsChunkPlugin({
            name: 'vendor-aot',
            minChunks: Infinity
        }),
        new AotPlugin({
            tsConfigPath: paths.app('tsconfig-aot.json'),
            entryModule: paths.src('renderer/app/app.module#AppModule')
        })
        // UglifyJS has issue for es6(...) fuck
    ],
    stats: {
        colors: true
    },
    target: 'electron-renderer'
};

module.exports = config;
