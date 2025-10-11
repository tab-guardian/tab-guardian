import { runtime } from "@common/modules/runtime"

export async function renderWarningBadge(): Promise<void> {
    await runtime.action.setBadgeText({ text: '!' })
    await runtime.action.setBadgeBackgroundColor({ color: [245, 159, 0, 255] })
}

export async function clearWarningBadge(): Promise<void> {
    await runtime.action.setBadgeText({ text: '' })
}
