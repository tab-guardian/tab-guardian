export type Tab = browser.tabs.Tab | chrome.tabs.Tab

export type QueryInfo = chrome.tabs.QueryInfo | browser.tabs._QueryQueryInfo

export type PasswordBytes = {
    groupId: number
    bytes: number
}

export type PlatformRuntime = {
    storage: {
        MAX_BYTES_QUOTA: number
        get: <T>(key: string) => Promise<T | null>
        set: (key: string, value: string) => Promise<void>
        remove: (key: string) => Promise<void>
        getBytesInUse: () => Promise<number>
    }
}
