import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const manifestContent = JSON.parse(
    readFileSync(resolve(__dirname, 'public/manifest2.json'), 'utf-8'),
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
        viteStaticCopy({
            targets: [
                {
                    src: 'src/_locales',
                    dest: '',
                },
            ],
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
        __APP_VERSION__: JSON.stringify(manifestContent.version),
    },
})
