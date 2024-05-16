import type { Group, Link } from '@/types'
import CryptoJS from 'crypto-js'

export default (group: Group, pass: string): Group => {
    const encryptedLinks: Link[] = []

    for (const link of group.links) {
        encryptedLinks.push(encryptLink(link, pass))
    }

    group.links = encryptedLinks
    group.isEncrypted = true

    return group
}

function encryptLink(link: Link, pass: string): Link {
    return {
        id: link.id,
        url: encrypt(link.url, pass),
        title: encrypt(link.title, pass),
        favIconUrl: encrypt(link.favIconUrl, pass),
    }
}

function encrypt(text: string, pass: string): string {
    text = encodeURIComponent(text)
    return CryptoJS.AES.encrypt(text, pass).toString()
}
