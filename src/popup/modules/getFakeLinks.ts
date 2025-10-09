import type { Link } from '@common/types'

export function getFakeLinks(): Link[] {
    const rand = Date.now() + Math.floor(Math.random() * 1000)

    return [
        {
            id: 1 + rand,
            url: 'https://duckduckgo.com/',
            title: 'DuckDuckGo — Privacy, simplified',
            favIconUrl: 'https://duckduckgo.com/favicon.ico',
            isPinned: true,
        },
        {
            id: 2 + rand,
            url: 'https://serhii.io/',
            title: 'Блог для программистов 👍 | {S} Serhii',
            favIconUrl: 'https://serhii.io/favicon.png',
            isPinned: false,
        },
        {
            id: 3 + rand,
            url: 'https://telegram.org/',
            title: 'Telegram Messenger',
            favIconUrl: 'https://telegram.org/img/favicon.ico',
            isPinned: false,
        },
        {
            id: 4 + rand,
            url: 'https://jiskelo.dev/',
            title: 'Jiskelo',
            favIconUrl: 'https://jiskelo.dev/favicon.png',
            isPinned: false,
        },
        {
            id: 5 + rand,
            url: 'https://shobar.com.ua/',
            title: 'Shobar',
            favIconUrl: 'https://shobar.com.ua/wp-content/uploads/2020/02/placeholder-1.png',
            isPinned: false,
        },
    ]
}
