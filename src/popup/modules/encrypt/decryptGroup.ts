import type { Group, Link } from '@/types'
import CryptoJS from 'crypto-js'

export default (group: Group, pass: string): Group => {
    const decryptedLinks: Link[] = []

    for (const link of group.links) {
        decryptedLinks.push(decryptLink(link, pass))
    }

    group.links = decryptedLinks
    group.isEncrypted = false

    return group
}

function decryptLink(link: Link, pass: string): Link {
    return {
        id: link.id,
        url: decrypt(link.url, pass),
        title: decrypt(link.title, pass),
        favIconUrl: decrypt(link.favIconUrl, pass),
    }
}

function decrypt(text: string, pass: string): string {
    return CryptoJS.AES.decrypt(text, pass).toString(CryptoJS.enc.Utf8)
}
