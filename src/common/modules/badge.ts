import { targetBrowser } from "@common/modules/browser/targetBrowser"
import { isDevelopment } from "@common/modules/isDevelopment"
import { isFirefox } from "@common/modules/browser/isFirefox"

export async function renderWarningBadge(): Promise<void> {
    if (isDevelopment()) {
        console.info('Cannot render a badge in development')
        return
    }

    const action = isFirefox()
        ? browser.browserAction
        : chrome.action

    await action.setBadgeText({ text: '!' })
    await action.setBadgeBackgroundColor({ color: [245, 159, 0, 255] })
}

export async function clearWarningBadge(): Promise<void> {
    if (isDevelopment()) {
        console.info('Cannot clear the badge in development')
        return
    }

    await targetBrowser().browserAction.setBadgeText({ text: '' })
}
