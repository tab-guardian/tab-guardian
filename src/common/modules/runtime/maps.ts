import type { tabs, windows } from '@common/types/runtime'

export function mapToTab(tab: chrome.tabs.Tab | browser.tabs.Tab): tabs.Tab {
    return {
        status: tab.status,
        index: tab.index,
        openerTabId: tab.openerTabId,
        title: tab.title,
        url: tab.url,
        pinned: tab.pinned,
        highlighted: tab.highlighted,
        windowId: tab.windowId,
        active: tab.active,
        favIconUrl: tab.favIconUrl,
        id: tab.id,
        incognito: tab.incognito,
        audible: tab.audible,
        discarded: tab.discarded,
        autoDiscardable: tab.autoDiscardable,
        width: tab.width,
        height: tab.height,
        sessionId: tab.sessionId,
        lastAccessed: tab.lastAccessed,
    }
}

export function mapToWindow(
    win: chrome.windows.Window | browser.windows.Window,
): windows.Window {
    return {
        focused: win.focused,
        alwaysOnTop: win.alwaysOnTop,
        incognito: win.incognito,
        id: win.id,
        top: win.top,
        left: win.left,
        width: win.width,
        height: win.height,
        tabs: win.tabs,
        type: win.type,
        sessionId: win.sessionId,
        state: mapToWindowState(win.state),
    }
}

export function mapToWindowState(
    state: chrome.windows.Window['state'] | browser.windows.Window['state'],
): windows.Window['state'] {
    return state === 'docked' ? 'locked-fullscreen' : state
}
