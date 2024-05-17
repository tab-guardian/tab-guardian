/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './settings.html',
        './src/settings/**/*.{vue,ts}',
        './index.html',
        './src/popup/**/*.{vue,ts}',
    ],
    theme: {
        container: {
            center: true,
            padding: '1rem',
        },
        extend: {
            colors: {
                main: 'var(--tg-color-bg)',
                page: 'var(--tg-page)',
                'page-hover': 'var(--tg-page-hover)',
                border: 'var(--tg-color-border)',
                font: 'var(--tg-color-font)',
                'font-gray': 'var(--tg-color-font-gray)',
                primary: 'var(--tg-color-primary)',
                'primary-hover': 'var(--tg-color-primary-hover)',
                secondary: 'var(--tg-color-secondary)',
                'secondary-hover': 'var(--tg-color-secondary-hover)',
            },
        },
    },
    plugins: [],
}
