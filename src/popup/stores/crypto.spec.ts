// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, suite } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCryptoStore } from '@/stores/crypto'
import { fakeGroup, fakeLink } from '@common/modules/fake'
import { config } from '@common/config'

describe('cryptoStore', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('encryptGroup', () => {
        it('throws the error when password is empty', async () => {
            const cryptoStore = useCryptoStore()
            const group = fakeGroup({ isPrivate: true })

            await expect(cryptoStore.encryptGroup(group, '')).rejects.toThrowError()
        })

        it('encrypts a given group with password', async () => {
            const cryptoStore = useCryptoStore()

            const link = fakeLink()

            const group = fakeGroup({
                isPrivate: true,
                links: [link],
            })

            expect(group.isEncrypted).toBeFalsy()

            const encrypted = await cryptoStore.encryptGroup(group, 'password')

            expect(encrypted.isEncrypted).toBeTruthy()
            expect(encrypted.algo).equal(config.CURR_ENCRYPT_ALGO)

            const encryptedLink = encrypted.links[0]

            expect(encryptedLink.url).not.equal(link.url)
            expect(encryptedLink.favIconUrl).not.equal(link.favIconUrl)
            expect(encryptedLink.title).not.equal(link.title)
            expect(encryptedLink.salt).not.toHaveLength(0)
            expect(encryptedLink.iv).not.toHaveLength(0)
        })
    })

    suite('decryptGroup', () => {
        it('throws the error when password is empty', async () => {
            const cryptoStore = useCryptoStore()
            const group = fakeGroup({ isPrivate: true })
            const encrypted = await cryptoStore.encryptGroup(group, 'password')

            await expect(
                cryptoStore.decryptGroup(encrypted, ''),
            ).rejects.toThrowError()
        })

        it('decrypts a given group with password', async () => {
            const cryptoStore = useCryptoStore()
            const initialGroup = fakeGroup({ isPrivate: true })

            const pass = 'password'
            const encrypted = await cryptoStore.encryptGroup(initialGroup, pass)
            const group = await cryptoStore.decryptGroup(encrypted, pass)

            expect(group.isEncrypted).toBeFalsy()

            const initialLink = initialGroup.links[0]
            const link = group.links[0]

            expect(link.url).equal(initialLink.url)
            expect(link.favIconUrl).equal(initialLink.favIconUrl)
            expect(link.title).equal(initialLink.title)
        })

        it('throws error with non-existent salt', async () => {
            const cryptoStore = useCryptoStore()
            const group = fakeGroup({ isPrivate: true })

            const pass = 'password'
            const encrypted = await cryptoStore.encryptGroup(group, pass)
            delete encrypted.links[0].salt

            await expect(
                cryptoStore.decryptGroup(encrypted, pass),
            ).rejects.toThrowError()
        })

        it('throws error with non-existent iv', async () => {
            const cryptoStore = useCryptoStore()
            const group = fakeGroup({ isPrivate: true })

            const pass = 'password'
            const encrypted = await cryptoStore.encryptGroup(group, pass)
            delete encrypted.links[0].iv

            await expect(
                cryptoStore.decryptGroup(encrypted, pass),
            ).rejects.toThrowError()
        })

        it('throws error with non-existent "algo" field', async () => {
            const cryptoStore = useCryptoStore()
            const group = fakeGroup({ isPrivate: true })

            const pass = 'password'
            const encrypted = await cryptoStore.encryptGroup(group, pass)
            delete encrypted.algo

            await expect(
                cryptoStore.decryptGroup(encrypted, pass),
            ).rejects.toThrowError()
        })
    })
})
