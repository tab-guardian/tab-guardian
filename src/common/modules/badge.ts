import { targetBrowser } from "@common/modules/browser/targetBrowser"
import { isDevelopment } from "@common/modules/isDevelopment"

export async function renderWarningBadge(): Promise<void> {
    if (isDevelopment()) {
        console.info('Cannot render a badge in development')
        return
    }

    const target = targetBrowser()
    await target.browserAction.setBadgeText({ text: '!' })
    await target.browserAction.setBadgeBackgroundColor({ color: [245, 159, 0, 255] })
}

export async function clearWarningBadge(): Promise<void> {
    if (isDevelopment()) {
        console.info('Cannot clear the badge in development')
        return
    }

    await targetBrowser().browserAction.setBadgeText({ text: '' })
}
