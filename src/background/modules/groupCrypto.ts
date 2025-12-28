import type { EncryptionAlgo, Group, Link } from '@common/types'
import { config } from '@common/config'
import { fromBase64, toBase64 } from '@common/modules/base64'
import { sendEventMessage } from '@bg/modules/event'
import { groupStorage } from '@common/modules/storage/group'
import { passwordStorage } from '@common/modules/storage/password'
import {
    encrypt,
    createEncryptKey,
    createDecryptKey,
    decrypt,
} from '@common/modules/webCrypto'

export async function encryptGroup(group: Group, pass: string): Promise<void> {
    const encryptedLinks: Link[] = []
    const algo = group.algo || config.CURR_ENCRYPT_ALGO

    let linksEncrypted = 0

    for (const link of group.links) {
        const salt = crypto.getRandomValues(new Uint8Array(16))
        const iv = crypto.getRandomValues(new Uint8Array(16))
        const key = await createEncryptKey(pass, salt, algo)

        const urlBin = await encrypt(link.url, key, iv, algo)
        const titleBin = await encrypt(link.title, key, iv, algo)
        const favIconUrlBin = await encrypt(link.favIconUrl, key, iv, algo)

        linksEncrypted++

        encryptedLinks.push({
            id: link.id,
            tabId: link.tabId,
            url: toBase64(urlBin),
            title: toBase64(titleBin),
            favIconUrl: toBase64(favIconUrlBin),
            isPinned: link.isPinned,
            salt: toBase64(salt),
            iv: toBase64(iv),
        })

        await sendEventMessage({
            type: 'encryptionProgress',
            payload: { linksEncrypted },
        })
    }

    group.algo = algo
    group.links = encryptedLinks
    group.isEncrypted = true
    group.isPrivate = true

    await passwordStorage.delete(group.id)
    await groupStorage.save(group)
    await sendEventMessage({ type: 'groupEncrypted', payload: { group } })
}

export async function decryptGroup(
    group: Group,
    pass: string,
    rememberPass: boolean,
): Promise<void> {
    const decryptedLinks: Link[] = []

    let linksDecrypted = 0

    for (const link of group.links) {
        const decryptedLink = await decryptLink(group, link, pass)
        linksDecrypted++
        decryptedLinks.push(decryptedLink)

        await sendEventMessage({
            type: 'decryptionProgress',
            payload: { linksDecrypted },
        })
    }

    group.links = decryptedLinks
    group.isEncrypted = false

    if (rememberPass) {
        await passwordStorage.save(group.id, pass)
    }

    await groupStorage.save(group)
    await sendEventMessage({ type: 'groupDecrypted', payload: { group } })
}

async function decryptLink(group: Group, link: Link, pass: string): Promise<Link> {
    if (!group.algo) {
        return decryptLinkCryptoJS(link, pass)
    }

    if (!link.salt) {
        throw new Error(
            `Link ${link.id} doesn't have salt attached. Which should not happen`,
        )
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
        throw new Error(
            `Link ${link.id} doesn't have iv attached. Which should not happen`,
        )
    }

    const ivBytes = fromBase64(link.iv)

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
