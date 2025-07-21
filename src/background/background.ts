import { isFirefox } from '@common/modules/browser/isFirefox'
import { targetBrowser } from '@common/modules/browser/targetBrowser'

const target = targetBrowser()

target.runtime.onMessage.addListener(request => {
    if (request.type === 'closeTabs') {
        closeTabs(request.payload)
    }
})

async function closeTabs(ids: number[]): Promise<void> {
    // create a new tab to prevent closing the browser
    await target.tabs.create({})

    for (const id of ids) {
        await target.tabs.remove(id)
    }
}
