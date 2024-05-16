/** @type {import('tailwindcss').Config} */
module.exports = {
    purge: ['./settings.html', './src/settings/**/*.{vue,ts}'],
    content: [],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
            padding: '1rem',
        },
        extend: {
            colors: {
                main: 'var(--tg-color-bg)',
                'main-secondary': 'var(--tg-color-bg-secondary)',
                'main-secondary-hover': 'var(--tg-color-bg-secondary-hover)',
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
