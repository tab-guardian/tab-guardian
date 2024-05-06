import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'

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
                content: '/src/content/content.ts',
                popup: '/popup.html',
            },
            output: {
                entryFileNames: `assets/[name].js`,
            },
        },
    },

    resolve: {
        alias: {
            '@': '/src/popup',
            '@bg': '/src/background',
            '@content': '/src/content',
        },
    },
})
