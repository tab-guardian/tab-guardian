import { isFirefox } from '@common/modules/browser/isFirefox'

export default async (ids: number[]): Promise<void> => {
    if (isFirefox()) {
        await browser.runtime.sendMessage('closeTabs', { payload: ids })
        return
    }

    await chrome.runtime.sendMessage({ type: 'closeTabs', payload: ids })
}
