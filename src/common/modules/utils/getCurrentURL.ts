import { hashURL } from '@common/modules/url/hashURL'
import { runtime, isRuntime } from '@common/modules/runtime'

export async function getCurrentURL(hash = false): Promise<string | null> {
    if (isRuntime('web')) {
        return window.location.href
    }

    const tabs = await runtime.tabs.query({
        active: true,
        currentWindow: true,
    })

    if (tabs.length === 0) {
        return null
    }

    const url = tabs[0].url

    if (!url) {
        return null
    }

    if (hash) {
        return hashURL(url)
    }

    return url
}
