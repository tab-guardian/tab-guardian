import { hashURL } from '@common/modules/url/hashURL'
import { runtime } from '@common/modules/runtime'
import { isRuntime } from '@common/modules/runtime/utils'

type Params = {
    hash: boolean
}

export async function getCurrentURL(params?: Params): Promise<string | null> {
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

    if (params && params.hash) {
        return await hashURL(url)
    }

    return url
}
