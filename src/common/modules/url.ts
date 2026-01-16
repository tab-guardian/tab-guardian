import { runtime } from '@common/modules/runtime'
import { isRuntime } from '@common/modules/runtime/utils'
import { removeTrail } from '@common/modules'
import { validateImageUrl } from '@common/modules/validation/url'

export async function hashUrl(url: string): Promise<string> {
    const trimmed = removeTrail(url, '/')

    const arrBuffer = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(trimmed),
    )

    return Array.from(new Uint8Array(arrBuffer))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')
}

export async function getCurrentUrl(): Promise<string | null> {
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

    return url
}

export async function getHashedCurrentUrl(): Promise<string | null> {
    const url = await getCurrentUrl()
    return url ? await hashUrl(url) : null
}

export function isImageUrl(url: string | null | undefined): boolean {
    return url ? validateImageUrl(url) === null : false
}

export function isForbittenUrl(url: string): boolean {
    const isFirefox = isRuntime('firefox')

    if (!isFirefox || url === 'about:blank') {
        return false
    }

    // It's a limitation of Firefox, you cannot open about: and chrome: pages.
    // The only exception is `about:blank` which can be open.
    return url.startsWith('about:') || url.startsWith('chrome:')
}
