const webpack = require('webpack')
const mix = require('laravel-mix')

mix.ts('src/ts/app.ts', 'extension/popup.js')
    .vue()
    .options({
        processCssUrls: false,
        uglify: {
            uglifyOptions: {
                compress: {
                    drop_console: true,
                },
            },
        },
    })
    .webpackConfig({
        plugins: [
            new webpack.DefinePlugin({
                __VUE_OPTIONS_API__: true,
                __VUE_PROD_DEVTOOLS__: false,
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
            }),
        ],
    })
    .disableNotifications()
    .alias({
        '@': '/src/ts',
    })
