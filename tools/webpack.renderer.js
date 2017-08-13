const { ContextReplacementPlugin, NoEmitOnErrorsPlugin } = require('webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const paths = require('./paths');


const config = {
    devtool: 'source-map',
    entry: {
        polyfills: paths.src('renderer/polyfills.ts'),
        'boot-app': paths.src('renderer/boot-app.ts')
    },
    output: {
        path: paths.dist(),
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
                include: [paths.src('.')],
                exclude: [...paths.excludes()],
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            configFileName: paths.app('tsconfig.json')
                        }
                    },
                    { loader: 'angular2-template-loader' }
                ]
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
        new ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            paths.src('.'),
            {}
        ),
        new CommonsChunkPlugin({
            name: ['vendor'],
            minChunks(module) {
                return module.resource && (module.resource.startsWith(paths.nodeModules()));
            },
            chunks: ['boot-app']
        })
    ],
    stats: {
        colors: true
    },
    target: 'electron-renderer'
};

module.exports = config;
