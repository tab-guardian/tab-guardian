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
        url: CryptoJS.AES.decrypt(link.url, pass).toString(CryptoJS.enc.Utf8),
        title: CryptoJS.AES.decrypt(link.title, pass).toString(CryptoJS.enc.Utf8),
        favIconUrl: CryptoJS.AES.decrypt(link.favIconUrl, pass).toString(CryptoJS.enc.Utf8),
    }
}