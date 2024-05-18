import type { Link } from '@/types'
import localhostIcon from '@/assets/images/localhost.png'

export default (): Link[] => {
    return [
        {
            id: 1 + Date.now() + Math.floor(Math.random() * 1000),
            url: 'https://stackoverflow.com/questions/13137350/defining-typescript-callback-type',
            title: 'DuckDuckGo — Privacy, simplified. Trust me man',
            favIconUrl: 'https://duckduckgo.com/favicon.ico',
        },
        {
            id: 2 + Date.now() + Math.floor(Math.random() * 1000),
            url: 'https://serhii.io/',
            title: 'Blog for developers | {S} Serhii',
            favIconUrl: 'https://serhii.io/favicon.png',
        },
        {
            id: 3 + Date.now() + Math.floor(Math.random() * 1000),
            url: 'https://telegram.org/',
            title: 'Telegram Messenger',
            favIconUrl: 'https://telegram.org/img/favicon.ico',
        },
        {
            id: 3 + Date.now() + Math.floor(Math.random() * 1000),
            url: 'http://localhost:4444',
            title: 'Localhost Server',
            favIconUrl: localhostIcon,
        },
    ]
}
