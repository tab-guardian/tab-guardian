// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import {
    decryptExport,
    encryptExport,
    getEncryptionHeader,
} from '@common/modules/webCrypto'

describe('webCrypto module', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('encryptExport()', () => {
        it('prepends algorithm name to the beginning', async () => {
            const encrypted = await encryptExport('test string', 'password')
            const header = getEncryptionHeader()

            const msg = `encrypted string must start with ${header}`

            expect(encrypted.startsWith(header), msg).toBeTruthy()
        })

        it('encrypts text', async () => {
            const original = 'Support this idea!'

            let encrypted = await encryptExport(original, 'password')
            const prepend = getEncryptionHeader()

            encrypted = encrypted.replace(prepend, '')

            expect(encrypted).not.equal(original)
        })
    })

    suite('decryptExport()', () => {
        it('removes prepended algorithm header', async () => {
            const pass = 'password'
            const encrypted = await encryptExport('test string', pass)
            const header = getEncryptionHeader()

            const decrypted = await decryptExport(encrypted, pass)
            const msg = `encrypted text "${encrypted}" must not start "${header}"`

            expect(decrypted.startsWith(header), msg).toBeFalsy()
        })

        it('decrypts text', async () => {
            const text = 'You must win!'
            const pass = '-amy-adams-'

            const encrypted = await encryptExport(text, pass)
            const decrypted = await decryptExport(encrypted, pass)

            expect(decrypted).equal(text)
        })

        it('throws error if header is not present in encrypted text', async () => {
            const text = 'You must win!'
            const pass = 'my-password'
            const header = getEncryptionHeader()

            let encrypted = await encryptExport(text, pass)
            encrypted = encrypted.replace(header, '')

            await expect(decryptExport(encrypted, pass)).rejects.toThrowError()
        })
    })
})
