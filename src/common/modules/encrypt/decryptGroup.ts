import type { EncryptionAlgo, Group, Link } from '@/types'
import CryptoJS from 'crypto-js'
import { decryptWithWebpCrypto } from '@common/modules/encrypt/decryptWithWebCrypto'

export async function decryptGroup(group: Group, pass: string): Promise<Group> {
    const decryptedLinks: Link[] = []

    for (const link of group.links) {
        const decryptedLink = await decryptLink(link, pass, group.algo)
        decryptedLinks.push(decryptedLink)
    }

    group.links = decryptedLinks
    group.isEncrypted = false

    return group
}

async function decryptLink(
    link: Link,
    pass: string,
    encryptAlgo?: EncryptionAlgo,
): Promise<Link> {
    const url = await decrypt(link.url, pass, encryptAlgo)
    const title = await decrypt(link.title, pass, encryptAlgo)
    const favIconUrl = await decrypt(link.favIconUrl, pass, encryptAlgo)

    if (url + title + favIconUrl === '') {
        throw new Error('Malformed UTF-8 data')
    }

    return { ...link, url, title, favIconUrl }
}

async function decrypt(
    text: string,
    pass: string,
    encryptAlgo?: EncryptionAlgo,
): Promise<string> {
    if (!encryptAlgo) {
        return CryptoJS.AES.decrypt(text, pass).toString(CryptoJS.enc.Utf8)
    }

    return await decryptWithWebpCrypto(text, pass, encryptAlgo)
}

