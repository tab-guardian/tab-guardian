import { isDevelopment } from "@common/modules/isDevelopment"
import { isFirefox } from "@common/modules/browser/isFirefox"

export async function renderWarningBadge(): Promise<void> {
    if (isDevelopment()) {
        console.info('Cannot render a badge in development')
        return
    }

    await getAction().setBadgeText({ text: '!' })
    await getAction().setBadgeBackgroundColor({ color: [245, 159, 0, 255] })
}

export async function clearWarningBadge(): Promise<void> {
    if (isDevelopment()) {
        console.info('Cannot clear the badge in development')
        return
    }

    await getAction().setBadgeText({ text: '' })
}

function getAction(): typeof browser.browserAction | typeof chrome.action {
    return isFirefox() ? browser.browserAction : chrome.action
}
