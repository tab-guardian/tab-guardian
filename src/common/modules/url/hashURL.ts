import { removeTrail } from '@common/modules/utils'

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
