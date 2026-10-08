import type { EncryptionAlgo, Group, Link } from '@common/types'
import { useProgressStore } from '@/stores/progress'
import { defineStore } from 'pinia'
import {
    KEY_BYTES_LENGTH,
    encrypt,
    decrypt,
    createEncryptKey,
    createDecryptKey,
} from '@common/modules/webCrypto'
import { toBase64, fromBase64 } from '@common/modules/base64'
import { config } from '@common/config'
import { cloneDeep } from 'lodash'
import CryptoJS from 'crypto-js'

export const useCryptoStore = defineStore('crypto', () => {
    const progressStore = useProgressStore()

    function prependIv(cipher: Uint8Array, iv: Uint8Array): Uint8Array {
        const combined = new Uint8Array(iv.length + cipher.length)
        combined.set(iv, 0)
        combined.set(cipher, iv.length)
        return combined
    }

    async function encryptGroup(group: Group, pass: string): Promise<Group> {
        if (pass === '') {
            throw new Error('password should not be empty when encryping group')
        }

        const encrypted = cloneDeep(group)
        const encryptedLinks: Link[] = []
        const algo = encrypted.algo || config.CURR_ENCRYPT_ALGO

        progressStore.start(encrypted.links.length)

        for (const link of encrypted.links) {
            const salt = crypto.getRandomValues(new Uint8Array(KEY_BYTES_LENGTH))
            const key = await createEncryptKey(pass, salt, algo)

            const urlIv = crypto.getRandomValues(new Uint8Array(KEY_BYTES_LENGTH))
            const titleIv = crypto.getRandomValues(new Uint8Array(KEY_BYTES_LENGTH))
            const favIv = crypto.getRandomValues(new Uint8Array(KEY_BYTES_LENGTH))

            const urlBin = await encrypt(link.url, key, urlIv, algo)
            const titleBin = await encrypt(link.title, key, titleIv, algo)
            const favIconUrlBin = await encrypt(link.favIconUrl, key, favIv, algo)

            encryptedLinks.push({
                id: link.id,
                tabId: link.tabId,
                url: toBase64(prependIv(urlBin, urlIv)),
                title: toBase64(prependIv(titleBin, titleIv)),
                favIconUrl: toBase64(prependIv(favIconUrlBin, favIv)),
                isPinned: link.isPinned,
                salt: toBase64(salt),
            })

            progressStore.advance()
        }

        encrypted.algo = algo
        encrypted.links = encryptedLinks
        encrypted.isEncrypted = true

        progressStore.finish()

        return encrypted
    }

    async function decryptGroup(encrypted: Group, pass: string): Promise<Group> {
        if (pass === '') {
            throw new Error('password should not be empty when decrypting group')
        }

        const group = cloneDeep(encrypted)
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

    /**
     * If tab (link) has iv field that is not empty, it means it's a legacy
     * encryption that we were using with a single iv for all fields. Since
     * we now use unique IV for each field, we need to grab it from the
     * beginning of each field instead of the object field to keep it
     * backward compatible with the old implementation.
     */
    async function decryptLinkWebCrypto(
        link: Link,
        key: CryptoKey,
        algo: EncryptionAlgo,
    ): Promise<Link> {
        if (link.iv) {
            // Legacy way of decrypting the link
            const ivBytes = fromBase64(link.iv)

            const url = await decrypt(link.url, key, ivBytes, algo)
            const title = await decrypt(link.title, key, ivBytes, algo)
            const favIconUrl = await decrypt(link.favIconUrl, key, ivBytes, algo)

            // Take all fields from the object except iv
            const { iv: _, ...rest } = link

            return { ...rest, url, title, favIconUrl }
        }

        const decodedUrlCypher = fromBase64(link.url)
        const decodedTitleCypher = fromBase64(link.title)
        const decodedFavCypher = fromBase64(link.favIconUrl)

        // Get IVs from each field as the first bytes
        const urlIv = decodedUrlCypher.slice(0, KEY_BYTES_LENGTH)
        const titleIv = decodedTitleCypher.slice(0, KEY_BYTES_LENGTH)
        const favIv = decodedFavCypher.slice(0, KEY_BYTES_LENGTH)

        // Remove iv each field to decrypt it
        const urlCypher = decodedUrlCypher.slice(KEY_BYTES_LENGTH)
        const titleCypher = decodedTitleCypher.slice(KEY_BYTES_LENGTH)
        const favCypher = decodedFavCypher.slice(KEY_BYTES_LENGTH)

        const url = await decrypt(urlCypher, key, urlIv, algo)
        const title = await decrypt(titleCypher, key, titleIv, algo)
        const favIconUrl = await decrypt(favCypher, key, favIv, algo)

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
