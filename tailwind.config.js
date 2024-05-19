/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./*.html', './src/**/*.{vue,ts}'],
    theme: {
        container: {
            center: true,
            padding: '1rem',
        },
        extend: {
            colors: {
                page: 'var(--tg-color-page)',
                secondary: 'var(--tg-color-secondary)',
                'secondary-hover': 'var(--tg-color-secondary-hover)',
                'page-hover': 'var(--tg-color-page-hover)',
                border: 'var(--tg-color-border)',
                'border-hover': 'var(--tg-color-border-hover)',
                font: 'var(--tg-color-font)',
                'font-gray': 'var(--tg-color-font-gray)',
                primary: 'var(--tg-color-primary)',
                'primary-hover': 'var(--tg-color-primary-hover)',
                private: 'var(--tg-color-private)',
                'private-hover': 'var(--tg-color-private-hover)',
                'blue-1000': 'var(--tg-color-blue)',
                'orange-1000': 'var(--tg-color-orange)',
                'green-1000': 'var(--tg-color-green)',
                safe: 'var(--tg-color-safe)',
                'safe-hover': 'var(--tg-color-safe-hover)',
                unsafe: 'var(--tg-color-unsafe)',
                'unsafe-hover': 'var(--tg-color-unsafe-hover)',
            },
        },
    },
    plugins: [],
}
