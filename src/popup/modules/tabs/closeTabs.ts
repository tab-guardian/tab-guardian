import { isRuntime } from '@common/modules/runtime'

export async function closeTabs(ids: number[]): Promise<void> {
    if (isRuntime('firefox')) {
        await browser.runtime.sendMessage({ type: 'closeTabs', payload: ids })
        return
    }

    await chrome.runtime.sendMessage({ type: 'closeTabs', payload: ids })
}
