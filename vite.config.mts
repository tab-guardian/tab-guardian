import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const packageJson = JSON.parse(
    readFileSync(resolve(__dirname, 'package.json'), 'utf-8'),
)

export default defineConfig({
    plugins: [
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],

    build: {
        sourcemap: false,

        rollupOptions: {
            input: {
                background: '/src/background/background.ts',
                popup: '/index.html',
                settings: 'settings.html',
            },
            output: {
                entryFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
                chunkFileNames: `assets/[name].js`,
            },
        },
    },

    resolve: {
        alias: {
            '@': '/src/popup',
            '@bg': '/src/background',
            '@settings': '/src/settings',
            '@common': '/src/common',
        },
    },

    define: {
        APP_VERSION: JSON.stringify(packageJson.version),
    },
})
