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
        url: CryptoJS.AES.encrypt(link.url, pass).toString(),
        title: CryptoJS.AES.encrypt(link.title, pass).toString(),
        favIconUrl: CryptoJS.AES.encrypt(link.favIconUrl, pass).toString(),
    }
}
