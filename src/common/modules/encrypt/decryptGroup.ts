import type { EncryptionAlgo, Group, Link } from '@/types'
import CryptoJS from 'crypto-js'
import { decrypt, stringToUint8Arr } from '@common/modules/encrypt/webCrypto'
import { createDecryptKey } from '@common/modules/encrypt/webCrypto'

export async function decryptGroup(group: Group, pass: string): Promise<Group> {
    const decryptedLinks: Link[] = []

    for (const link of group.links) {
        const decryptedLink = await decryptLink(group, link, pass)
        decryptedLinks.push(decryptedLink)
    }

    group.links = decryptedLinks
    group.isEncrypted = false

    return group
}

async function decryptLink(group: Group, link: Link, pass: string): Promise<Link> {
    if (!group.algo) {
        return decryptLinkCryptoJS(link, pass)
    }

    if (!link.salt) {
        throw new Error(`Link ${link.id} doesn't have salt attached. Which should not happen`)
    }

    const key = await createDecryptKey(pass, link.salt, group.algo)

    return decryptLinkWebCrypto(link, key, group.algo)
}

async function decryptLinkWebCrypto(
    link: Link,
    key: CryptoKey,
    algo: EncryptionAlgo,
): Promise<Link> {
    if (!link.iv) {
        throw new Error(`Link ${link.id} doesn't have iv attached. Which should not happen`)
    }

    const ivBytes = stringToUint8Arr(link.iv)

    const url = await decrypt(link.url, key, ivBytes, algo)
    const title = await decrypt(link.title, key, ivBytes, algo)
    const favIconUrl = await decrypt(link.favIconUrl, key, ivBytes, algo)

    return { ...link, url, title, favIconUrl }
}

function decryptLinkCryptoJS(link: Link, pass: string): Link {
    const url = decryptCryptoJS(link.url, pass)
    const title = decryptCryptoJS(link.title, pass)
    const favIconUrl = decryptCryptoJS(link.favIconUrl, pass)

    if (url + title + favIconUrl === '') {
        throw new Error('Malformed UTF-8 data')
    }

    return { ...link, url, title, favIconUrl }
}

function decryptCryptoJS(text: string, pass: string): string {
    return CryptoJS.AES.decrypt(text, pass).toString(CryptoJS.enc.Utf8)
}

