import type { Link } from '@/types'

export function getFakeLinks(): Link[] {
    return [
        {
            id: 1 + Date.now() + Math.floor(Math.random() * 1000),
            url: 'https://stackoverflow.com/questions/13137350/defining-typescript-callback-type',
            title: 'DuckDuckGo — Privacy, simplified. Trust me man',
            favIconUrl: 'https://duckduckgo.com/favicon.ico',
            isPinned: true,
        },
        {
            id: 2 + Date.now() + Math.floor(Math.random() * 1000),
            url: 'https://serhii.io/',
            title: 'Blog for developers | {S} Serhii',
            favIconUrl: 'https://serhii.io/favicon.png',
            isPinned: false,
        },
        {
            id: 3 + Date.now() + Math.floor(Math.random() * 1000),
            url: 'https://telegram.org/',
            title: 'Telegram Messenger',
            favIconUrl: 'https://telegram.org/img/favicon.ico',
            isPinned: false,
        },
    ]
}
