export type ThemeMessage = {
    theme: 'dark' | 'light'
}

export type OpenTabMessage = {
    openTab: {
        url: string
        active: boolean
    }
}
