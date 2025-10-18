import { runtime } from '@common/modules/runtime'
import { isRuntime } from '@common/modules/runtime/utils'
import { removeTrail } from '@common/modules/utils'
import { validateImageURL } from '@common/modules/url/validateImageURL'

export async function hashURL(url: string): Promise<string> {
    const trimmedURL = removeTrail(url, '/')

    const arrBuffer = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(trimmedURL),
    )

    return Array.from(new Uint8Array(arrBuffer))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')
}

type GetCurrentURLParams = {
    hash: boolean
}

export async function getCurrentURL(
    params?: GetCurrentURLParams,
): Promise<string | null> {
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

export function isImageURL(url: string | null | undefined): boolean {
    return url ? validateImageURL(url) === null : false
}
