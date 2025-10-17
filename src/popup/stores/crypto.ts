import type { EncryptionAlgo, Group, Link } from '@common/types'
import { useProgressStore } from '@/stores/progress'
import { defineStore } from 'pinia'
import {
    encrypt,
    decrypt,
    createEncryptKey,
    createDecryptKey,
} from '@common/modules/webCrypto'
import { toBase64, fromBase64 } from '@common/modules/utils'
import { config } from '@common/config'
import CryptoJS from 'crypto-js'

export const useCryptoStore = defineStore('crypto', () => {
    const progressStore = useProgressStore()

    async function encryptGroup(group: Group, pass: string): Promise<Group> {
        const encryptedLinks: Link[] = []
        const algo = group.algo || config.CURR_ENCRYPT_ALGO

        progressStore.start(group.links.length)

        for (const link of group.links) {
            const salt = crypto.getRandomValues(new Uint8Array(16))
            const iv = crypto.getRandomValues(new Uint8Array(16))
            const key = await createEncryptKey(pass, salt, algo)

            const urlBin = await encrypt(link.url, key, iv, algo)
            const titleBin = await encrypt(link.title, key, iv, algo)
            const favIconUrlBin = await encrypt(link.favIconUrl, key, iv, algo)

            encryptedLinks.push({
                id: link.id,
                url: toBase64(urlBin),
                title: toBase64(titleBin),
                favIconUrl: toBase64(favIconUrlBin),
                isPinned: link.isPinned,
                salt: toBase64(salt),
                iv: toBase64(iv),
            })

            progressStore.advance()
        }

        group.algo = algo
        group.links = encryptedLinks
        group.isEncrypted = true

        progressStore.finish()

        return group
    }

    async function decryptGroup(group: Group, pass: string): Promise<Group> {
        const decryptedLinks: Link[] = []

        progressStore.start(group.links.length)

        for (const link of group.links) {
            const decryptedLink = await decryptLink(group, link, pass)
            progressStore.advance()
            decryptedLinks.push(decryptedLink)
        }

        group.links = decryptedLinks
        group.isEncrypted = false

        progressStore.finish()

        return group
    }

    async function decryptLink(
        group: Group,
        link: Link,
        pass: string,
    ): Promise<Link> {
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

    return {
        encryptGroup,
        decryptGroup,
    }
})
