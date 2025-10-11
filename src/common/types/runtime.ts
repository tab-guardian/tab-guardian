export type RuntimeType =
    | 'chrome'
    | 'firefox'
    | 'web'

export type PlatformRuntime = {
    /**
     * @returns Localized string
     */
    trans(msg: string, ...args: string[]): string

    /**
     * Converts a relative path within an app/extension install directory to a fully-qualified URL.
     * @param path A path to a resource within an app/extension expressed relative to its install directory.
     * @returns The fully-qualified URL to the resource.
     */
    getURL(path: string): string

    /**
     * Sends a single message to event listeners within your extension/app or
     * a different extension/app. Similar to runtime.connect but only sends
     * a single message, with an optional response. If sending to your
     * extension, the runtime.onMessage event will be fired in each page,
     * or runtime.onMessageExternal, if a different extension. Note that
     * extensions cannot send messages to content scripts using this method.
     * To send messages to content scripts, use tabs.sendMessage.
     */
    sendMessage<M = any>(message: M): Promise<void>

    extension: {
        lastError(): string | null
        isAllowedIncognitoAccess(): Promise<boolean>
    }

    action: {
        /**
         * Sets the badge text for the action. The badge is displayed on top
         * of the icon.
         */
        setBadgeText(details: action.BadgeTextDetails): Promise<void>

        /**
         * Sets the background color for the badge.
         */
        setBadgeBackgroundColor(details: action.BadgeColorDetails): Promise<void>
    }

    storage: {
        MAX_BYTES_QUOTA: number
        get<T>(key: string): Promise<T | null>
        all(): Promise<{ [key: string]: string }>
        set<T>(key: string, value: T | null | undefined): Promise<void>
        remove(key: string): Promise<void>
        getBytesInUse(): Promise<number>
    }

    tabs: {
        query(queryInfo: tabs.QueryInfo): Promise<tabs.Tab[]>
        create(createProperties: tabs.CreateProperties): Promise<tabs.Tab | null>
        remove(tabId: number): Promise<void>
    }

    windows: {
        getCurrent(): Promise<windows.Window | null>
        update(windowId: number, updateInfo: windows.UpdateInfo): Promise<windows.Window | null>
    }
}

export namespace tabs {
    export type Status = 'loading' | 'complete'

    export type Tab = {
        /**
         * The zero-based index of the tab within its window.
         */
        index: number

        /**
         * Whether the tab is pinned.
         */
        pinned: boolean

        /**
         * Whether the tab is in an incognito window.
         */
        incognito: boolean

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
         * Whether the tab can be discarded automatically by the browser when
         * resources are low.
         */
        autoDiscardable?: boolean

        /**
         * The ID of the tab that opened this tab, if any.
         * This property is only present if the opener tab still exists.
         */
        openerTabId?: number

        /**
         * The title of the tab. This property is only present if the
         * extension's manifest includes the "tabs" permission.
         */
        title?: string

        /**
         * The URL the tab is displaying. This property is only present if the
         * extension's manifest includes the "tabs" permission.
         */
        url?: string

        /**
         * The URL of the tab's favicon. This property is only present if the
         * extension's manifest includes the "tabs" permission. It may also be an
         * empty string if the tab is loading.
         */
        favIconUrl?: string

        /**
         * Either loading or complete.
         */
        status?: string

        /**
         * The ID of the tab. Tab IDs are unique within a browser session.
         * Under some circumstances a Tab may not be assigned an ID, for example
         * when querying foreign tabs using the sessions API, in which case a
         * session ID may be present.
         * 
         */
        id?: number

        /**
         * Whether the tab has produced sound over the past couple of seconds
         * (but it might not be heard if also muted). Equivalent to whether
         * the speaker audio indicator is showing.
         */
        audible?: boolean

        /**
         * Whether the tab is discarded. A discarded tab is one whose content has
         * been unloaded from memory, but is still visible in the tab strip.
         * Its content gets reloaded the next time it's activated.
         */
        discarded?: boolean

        /**
         * The width of the tab in pixels.
         */
        width?: number

        /**
         * The height of the tab in pixels.
         */
        height?: number

        /**
         * The session ID used to uniquely identify a Tab obtained from the
         * sessions API.
         */
        sessionId?: string

        /**
         * The last time the tab was accessed as the number of milliseconds
         * since epoch.
         */
        lastAccessed?: number
    }

    export type QueryInfo = {
        /**
         * Whether the tabs have completed loading.
         */
        status?: tabs.Status

        /**
         * Whether the tabs are in the last focused window.
         */
        lastFocusedWindow?: boolean

        /**
         * The ID of the parent window, or windows.WINDOW_ID_CURRENT for the current window.
         */
        windowId?: number

        /**
         * The type of window the tabs are in.
         * One of: "normal", "popup", "panel", "app", or "devtools"
         */
        windowType?: windows.Type

        /**
         * Whether the tabs are active in their windows.
         */
        active?: boolean

        /**
         * The position of the tabs within their windows.
         */
        index?: number

        /**
         * Match page titles against a pattern.
         */
        title?: string

        /**
         * Match tabs against one or more URL patterns.
         * Note that fragment identifiers are not matched.
         */
        url?: string | string[]

        /**
         * Whether the tabs are in the current window.
         */
        currentWindow?: boolean

        /**
         * Whether the tabs are highlighted.
         */
        highlighted?: boolean

        /**
         * Whether the tabs are discarded.
         * A discarded tab is one whose content has been unloaded from memory,
         * but is still visible in the tab strip. Its content gets reloaded the
         * next time it's activated.
         * True while the tabs are not loaded with content.
         */
        discarded?: boolean

        /**
         * Whether the tabs can be discarded automatically by the browser when
         * resources are low.
         */
        autoDiscardable?: boolean

        /**
         * Whether the tabs are pinned.
         */
        pinned?: boolean

        /**
         * Whether the tabs are audible.
         */
        audible?: boolean

        /**
         * Whether the tabs are muted.
         */
        muted?: boolean

        /**
         * The ID of the group that the tabs are in, or
         * chrome.tabGroups.TAB_GROUP_ID_NONE for ungrouped tabs.
         * @see Chrome only
         */
        groupId?: number

        /**
         * The CookieStoreId used for the tab.
         * @see Firefox only
         */
        cookieStoreId?: string[] | string

        /**
         * The ID of the tab that opened this tab. If specified,
         * the opener tab must be in the same window as this tab.
         * @see Firefox only
         */
        openerTabId?: number
    }

    export type CreateProperties = {
        /**
         * The position the tab should take in the window.
         * The provided value will be clamped to between zero and the number of
         * tabs in the window.
         */
        index?: number

        /**
         * The ID of the tab that opened this tab.
         * If specified, the opener tab must be in the same window as the
         * newly created tab.
         */
        openerTabId?: number

        /**
         * The URL to navigate the tab to initially.
         * Fully-qualified URLs must include a scheme
         * (i.e. 'http://www.google.com', not 'www.google.com').
         * Relative URLs will be relative to the current page within the extension.
         * Defaults to the New Tab Page.
         */
        url?: string

        /**
         * Whether the tab should be pinned.
         * Defaults to false.
         */
        pinned?: boolean

        /**
         * The window to create the new tab in.
         * Defaults to the current window.
         */
        windowId?: number

        /**
         * Whether the tab should become the active tab in the window.
         * Does not affect whether the window is focused (see windows.update).
         * Defaults to true.
         */
        active?: boolean

        /**
         * The CookieStoreId for the tab that opened this tab.
         * @see Firefox only
         */
        cookieStoreId?: string

        /**
         * Whether the document in the tab should be opened in reader mode.
         * @see Firefox only
         */
        openInReaderMode?: boolean

        /**
         * Whether the tab is marked as 'discarded' when created.
         * @see Firefox only
         */
        discarded?: boolean

        /**
         * The title used for display if the tab is created in discarded mode.
         * @see Firefox only
         */
        title?: string

        /**
         * Whether the tab should be muted when created.
         * @see Firefox only
         */
        muted?: boolean

        /**
         * Whether the document in the tab can be rendered in reader mode.
         * @see Firefox only
         */
        isArticle?: boolean

        /**
         * Whether the document in the tab is being rendered in reader mode.
         * @see Firefox only
         */
        isInReaderMode?: boolean

        /**
         * Whether the tab is drawing attention.
         * @see Firefox only
         */
        attention?: boolean

        /**
         * The ID of this tab's successor, if any;
         * `browser.tabs.TAB_ID_NONE` otherwise.
         * @see Firefox only
         */
        successorTabId?: number
    }
}

export namespace windows {
    export type Type =
        | "normal"
        | "popup"
        | "panel"
        | "app"
        | "devtools"

    export type State =
        | 'normal'
        | 'minimized'
        | 'maximized'
        | 'fullscreen'
        | 'locked-fullscreen'

    export type Window = {
        /**
         * Whether the window is currently the focused window.
         */
        focused: boolean

        /**
         * Whether the window is set to be always on top.
         */
        alwaysOnTop: boolean

        /**
         * Whether the window is incognito.
         */
        incognito: boolean

        /**
         * The ID of the window. Window IDs are unique within a browser session.
         * Under some circumstances a Window may not be assigned an ID,
         * for example when querying windows using the `sessions` API, in which
         * case a session ID may be present.
         */
        id?: number

        /**
         * The offset of the window from the top edge of the screen in pixels.
         * Under some circumstances a Window may not be assigned top property,
         * for example when querying closed windows from the `sessions` API.
         */
        top?: number

        /**
         * The offset of the window from the left edge of the screen in pixels.
         * Under some circumstances a Window may not be assigned left property,
         * for example when querying closed windows from the `sessions` API.
         */
        left?: number

        /**
         * The width of the window, including the frame, in pixels.
         * Under some circumstances a Window may not be assigned width property,
         * for example when querying closed windows from the `sessions` API.
         */
        width?: number

        /**
         * The height of the window, including the frame, in pixels.
         * Under some circumstances a Window may not be assigned height property,
         * for example when querying closed windows from the `sessions` API.
         */
        height?: number

        /**
         * Array of `Tab` objects representing the current tabs in the window.
         */
        tabs?: tabs.Tab[]

        /**
         * The type of browser window this is.
         */
        type?: Type

        /**
         * The state of this browser window.
         */
        state?: State

        /**
         * The session ID used to uniquely identify a Window obtained from
         * the `sessions` API.
         */
        sessionId?: string
    }

    export type UpdateInfo = {
        /**
         * The offset from the top edge of the screen to move the window to
         * in pixels. This value is ignored for panels.
         */
        top?: number

        /**
         * If true, causes the window to be displayed in a manner that draws
         * the user's attention to the window, without changing the focused
         * window. The effect lasts until the user changes focus to the window.
         * This option has no effect if the window already has focus. Set to
         * false to cancel a previous draw attention request.
         */
        drawAttention?: boolean

        /**
         * The height to resize the window to in pixels.
         * This value is ignored for panels.
         */
        height?: number

        /**
         * The width to resize the window to in pixels.
         * This value is ignored for panels.
         */
        width?: number

        /**
         * The new state of the window. The 'minimized', 'maximized' and
         * 'fullscreen' states cannot be combined with 'left', 'top',
         * 'width' or 'height'.
         */
        state?: State

        /**
         * If true, brings the window to the front. If false, brings the next
         * window in the z-order to the front.
         */
        focused?: boolean

        /**
         * The offset from the left edge of the screen to move the window to
         * in pixels. This value is ignored for panels.
         */
        left?: number
    }
}

export namespace action {
    export type BadgeTextDetails = {
        /**
         * Any number of characters can be passed, but only about four
         * can fit in the space.
         */
        text: string

        /**
         * Limits the change to when a particular tab is selected.
         * Automatically resets when the tab is closed.
         */
        tabId?: number
    }

    export type ColorArray = [number, number, number, number]

    export type BadgeColorDetails = {
        /**
         * An array of four integers in the range [0,255] that make up the
         * RGBA color of the badge. For example, opaque red is
         * [255, 0, 0, 255]. Can also be a string with a CSS value, with
         * opaque red being #FF0000 or #F00.
         */
        color: string | ColorArray

        /**
         * Limits the change to when a particular tab is selected.
         * Automatically resets when the tab is closed.
         */
        tabId?: number
    }
}
