export type Tab = browser.tabs.Tab | chrome.tabs.Tab

export type QueryInfo = chrome.tabs.QueryInfo | browser.tabs._QueryQueryInfo

export type PasswordBytes = {
    groupId: number
    bytes: number
}
