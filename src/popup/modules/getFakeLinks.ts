import type { Link } from '@/types'

export default (): Link[] => {
    return [
        {
            id: 1 + Date.now(),
            url: 'https://soundcloud.com/etolubov_official/mango',
            title: 'DuckDuckGo — Privacy, simplified. Trust me man',
            favIconUrl: 'https://duckduckgo.com/favicon.ico',
        },
        {
            id: 2 + Date.now(),
            url: 'https://serhii.io/',
            title: 'Blog for developers | {S} Serhii',
            favIconUrl: 'https://serhii.io/favicon.png',
        },
        {
            id: 3 + Date.now(),
            url: 'https://telegram.org/',
            title: 'Telegram Messenger',
            favIconUrl: 'https://telegram.org/img/favicon.ico',
        },
    ]
}
