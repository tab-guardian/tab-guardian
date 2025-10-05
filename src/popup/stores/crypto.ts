import type { EncryptionAlgo, Group, Link } from '@/types'
import { reactive, readonly } from 'vue'
import { defineStore } from 'pinia'
import { encrypt, decrypt, uint8ArrToString, createEncryptKey, createDecryptKey, stringToUint8Arr } from '@common/modules/webCrypto'
import { env } from '@common/env'
import CryptoJS from 'crypto-js'

export const useCryptoStore = defineStore('crypto', () => {
    const progress = reactive({
        max: 0,
        current: 0,
    })

    function resetProgress(): void {
        progress.max = 0
        progress.current = 0
    }

    async function encryptGroup(group: Group, pass: string): Promise<Group> {
        const encryptedLinks: Link[] = []
        const encryptAlgo = group.algo || env.CURR_ENCRYPT_ALGO

        progress.max = group.links.length

        for (const link of group.links) {
            const salt = crypto.getRandomValues(new Uint8Array(16))
            const iv = crypto.getRandomValues(new Uint8Array(16))
            const key = await createEncryptKey(pass, salt, encryptAlgo)

            encryptedLinks.push({
                id: link.id,
                url: uint8ArrToString(await encrypt(link.url, key, iv, encryptAlgo)),
                title: uint8ArrToString(await encrypt(link.title, key, iv, encryptAlgo)),
                favIconUrl: uint8ArrToString(await encrypt(link.favIconUrl, key, iv, encryptAlgo)),
                isPinned: link.isPinned,
                salt: uint8ArrToString(salt),
                iv: uint8ArrToString(iv),
            })

            progress.current++
        }

        group.algo = encryptAlgo
        group.links = encryptedLinks
        group.isEncrypted = true

        resetProgress()

        return group
    }

    async function decryptGroup(group: Group, pass: string): Promise<Group> {
        const decryptedLinks: Link[] = []

        progress.max = group.links.length

        for (const link of group.links) {
            const decryptedLink = await decryptLink(group, link, pass)
            progress.current++
            decryptedLinks.push(decryptedLink)
        }

        group.links = decryptedLinks
        group.isEncrypted = false

        resetProgress()

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

    return {
        progress: readonly(progress),
        encryptGroup,
        decryptGroup,
    }
})
