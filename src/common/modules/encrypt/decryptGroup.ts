import type { Group, Link } from '@/types'
import CryptoJS from 'crypto-js'

export function decryptGroup(group: Group, pass: string): Group {
    const decryptedLinks: Link[] = []

    for (const link of group.links) {
        decryptedLinks.push(decryptLink(link, pass))
    }

    group.links = decryptedLinks
    group.isEncrypted = false

    return group
}

function decryptLink(link: Link, pass: string): Link {
    const url = decrypt(link.url, pass)
    const title = decrypt(link.title, pass)
    const favIconUrl = decrypt(link.favIconUrl, pass)

    if (url + title + favIconUrl === '') {
        throw new Error('Malformed UTF-8 data')
    }

    return { ...link, url, title, favIconUrl }
}

function decrypt(text: string, pass: string): string {
    return CryptoJS.AES.decrypt(text, pass).toString(CryptoJS.enc.Utf8)
}
