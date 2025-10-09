export type Runtime = 'chrome' | 'firefox' | 'web'

export type PlatformRuntime = {
    storage: {
        MAX_BYTES_QUOTA: number
        get: <T>(key: string) => Promise<T | null>
        set: <T>(key: string, value: T | null | undefined) => Promise<void>
        remove: (key: string) => Promise<void>
        getBytesInUse: () => Promise<number>
    }
    tabs: {
        query: (queryInfo: TabsQueryInfo) => Promise<Tab[]>
        create: (createProperties: CreateTabParams) => Promise<Tab>
        remove: (tabId: number) => Promise<void>
    }
}

export type Tab = {
    /**
     * Either loading or complete.
     */
    status?: string | undefined

    /**
     * The zero-based index of the tab within its window.
     */
    index: number

    /**
     * The ID of the tab that opened this tab, if any.
     * This property is only present if the opener tab still exists.
     */
    openerTabId?: number | undefined

    /**
     * The title of the tab. This property is only present if the
     * extension's manifest includes the "tabs" permission.
     */
    title?: string | undefined

    /**
     * The URL the tab is displaying. This property is only present if the
     * extension's manifest includes the "tabs" permission.
     */
    url?: string | undefined

    /**
     * Whether the tab is pinned.
     */
    pinned: boolean

    /**
     * Whether the tab is highlighted.
     */
    highlighted: boolean

    /**
     * The ID of the window the tab is contained within.
     */
    windowId?: number

    /**
     * Whether the tab is active in its window.
     * (Does not necessarily mean the window is focused.)
     */
    active: boolean

    /**
     * The URL of the tab's favicon. This property is only present if the
     * extension's manifest includes the "tabs" permission. It may also be an
     * empty string if the tab is loading.
     */
    favIconUrl?: string | undefined

    /**
     * The ID of the tab. Tab IDs are unique within a browser session.
     * Under some circumstances a Tab may not be assigned an ID, for example
     * when querying foreign tabs using the sessions API, in which case a
     * session ID may be present.
     * 
     */
    id?: number | undefined

    /**
     * Whether the tab is in an incognito window.
     */
    incognito: boolean

    /**
     * Whether the tab has produced sound over the past couple of seconds
     * (but it might not be heard if also muted). Equivalent to whether
     * the speaker audio indicator is showing.
     */
    audible?: boolean | undefined

    /**
     * Whether the tab is discarded. A discarded tab is one whose content has
     * been unloaded from memory, but is still visible in the tab strip.
     * Its content gets reloaded the next time it's activated.
     */
    discarded: boolean

    /**
     * Whether the tab can be discarded automatically by the browser when
     * resources are low.
     */
    autoDiscardable: boolean

    /**
     * The width of the tab in pixels.
     */
    width?: number | undefined

    /**
     * The height of the tab in pixels.
     */
    height?: number | undefined

    /**
     * The session ID used to uniquely identify a Tab obtained from the
     * sessions API.
     */
    sessionId?: string | undefined

    /**
     * The last time the tab was accessed as the number of milliseconds
     * since epoch.
     */
    lastAccessed?: number | undefined

    /**
     * The URL the tab is navigating to, before it has committed.
     * This property is only present if the extension's manifest includes
     * the "tabs" permission and there is a pending navigation.
     * @see Chrome only
     */
    pendingUrl?: string | undefined

    /**
     * True if the tab is hidden.
     * @see Firefox only
     */
    hidden?: boolean | undefined

    /**
     * The ID of the group that the tab belongs to.
     * @see Chrome only
     */
    groupId: number
}

type TabStatus = 'loading' | 'complete'

type WindowType =
    | "normal"
    | "popup"
    | "panel"
    | "app"
    | "devtools"

type TabsQueryInfo = {
    /**
     * Whether the tabs have completed loading.
     */
    status?: TabStatus | undefined

    /**
     * Whether the tabs are in the last focused window.
     */
    lastFocusedWindow?: boolean | undefined

    /**
     * The ID of the parent window, or windows.WINDOW_ID_CURRENT for the current window.
     */
    windowId?: number | undefined

    /**
     * The type of window the tabs are in.
     * One of: "normal", "popup", "panel", "app", or "devtools"
     */
    windowType?: WindowType | undefined

    /**
     * Whether the tabs are active in their windows.
     */
    active?: boolean | undefined

    /**
     * The position of the tabs within their windows.
     */
    index?: number | undefined

    /**
     * Match page titles against a pattern.
     */
    title?: string | undefined

    /**
     * Match tabs against one or more URL patterns.
     * Note that fragment identifiers are not matched.
     */
    url?: string | string[] | undefined

    /**
     * Whether the tabs are in the current window.
     */
    currentWindow?: boolean | undefined

    /**
     * Whether the tabs are highlighted.
     */
    highlighted?: boolean | undefined

    /**
     * Whether the tabs are discarded.
     * A discarded tab is one whose content has been unloaded from memory,
     * but is still visible in the tab strip. Its content gets reloaded the
     * next time it's activated.
     * True while the tabs are not loaded with content.
     */
    discarded?: boolean | undefined

    /**
     * Whether the tabs can be discarded automatically by the browser when
     * resources are low.
     */
    autoDiscardable?: boolean | undefined

    /**
     * Whether the tabs are pinned.
     */
    pinned?: boolean | undefined

    /**
     * Whether the tabs are audible.
     */
    audible?: boolean | undefined

    /**
     * Whether the tabs are muted.
     */
    muted?: boolean | undefined

    /**
     * The ID of the group that the tabs are in, or
     * chrome.tabGroups.TAB_GROUP_ID_NONE for ungrouped tabs.
     * @see Chrome only
     */
    groupId?: number | undefined

    /**
     * True while the tabs are hidden.
     * @see Firefox only
     */
    hidden?: boolean | undefined

    /**
     * The CookieStoreId used for the tab.
     * @see Firefox only
     */
    cookieStoreId?: string[] | string | undefined

    /**
     * The ID of the tab that opened this tab. If specified,
     * the opener tab must be in the same window as this tab.
     * @see Firefox only
     */
    openerTabId?: number | undefined
}

type CreateTabParams = {
    /**
     * The position the tab should take in the window.
     * The provided value will be clamped to between zero and the number of
     * tabs in the window.
     */
    index?: number | undefined

    /**
     * The ID of the tab that opened this tab.
     * If specified, the opener tab must be in the same window as the
     * newly created tab.
     */
    openerTabId?: number | undefined

    /**
     * The URL to navigate the tab to initially.
     * Fully-qualified URLs must include a scheme
     * (i.e. 'http://www.google.com', not 'www.google.com').
     * Relative URLs will be relative to the current page within the extension.
     * Defaults to the New Tab Page.
     */
    url?: string | undefined

    /**
     * Whether the tab should be pinned.
     * Defaults to false.
     */
    pinned?: boolean | undefined

    /**
     * The window to create the new tab in.
     * Defaults to the current window.
     */
    windowId?: number | undefined

    /**
     * Whether the tab should become the active tab in the window.
     * Does not affect whether the window is focused (see windows.update).
     * Defaults to true.
     */
    active?: boolean | undefined

    /**
     * The CookieStoreId for the tab that opened this tab.
     * @see Firefox only
     */
    cookieStoreId?: string | undefined

    /**
     * Whether the document in the tab should be opened in reader mode.
     * @see Firefox only
     */
    openInReaderMode?: boolean | undefined

    /**
     * Whether the tab is marked as 'discarded' when created.
     * @see Firefox only
     */
    discarded?: boolean | undefined

    /**
     * The title used for display if the tab is created in discarded mode.
     * @see Firefox only
     */
    title?: string | undefined

    /**
     * Whether the tab should be muted when created.
     * @see Firefox only
     */
    muted?: boolean | undefined

    /**
     * Whether the document in the tab can be rendered in reader mode.
     * @see Firefox only
     */
    isArticle?: boolean | undefined

    /**
     * Whether the document in the tab is being rendered in reader mode.
     * @see Firefox only
     */
    isInReaderMode?: boolean | undefined

    /**
     * Whether the tab is drawing attention.
     * @see Firefox only
     */
    attention?: boolean | undefined

    /**
     * The ID of this tab's successor, if any;
     * `browser.tabs.TAB_ID_NONE` otherwise.
     * @see Firefox only
     */
    successorTabId?: number | undefined
}
