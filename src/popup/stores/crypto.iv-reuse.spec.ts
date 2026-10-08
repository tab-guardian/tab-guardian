// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, afterEach, suite, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCryptoStore } from '@/stores/crypto'
import { fakeGroup, fakeLink } from '@common/modules/fake'
import { fromBase64 } from '@common/modules/base64'
import * as webCrypto from '@common/modules/webCrypto'

// AES-GCM auth tag appended by WebCrypto is 16 bytes and must be
// excluded from the keystream-XOR math (it is not CTR keystream).
const GCM_TAG_BYTES = 16

// Attacker-side helper. Deliberately takes NO password and NO key,
// only the stored cipher + known/guessed text of one field.
function recoverPrefix(
    cipherA_Base64: string,
    cipherB_Base64: string,
    knownTextB: string,
): string {
    const cipherA = fromBase64(cipherA_Base64).slice(0, -GCM_TAG_BYTES)
    const cipherB = fromBase64(cipherB_Base64).slice(0, -GCM_TAG_BYTES)
    const knownB = new TextEncoder().encode(knownTextB)

    const recoveredBytesCount = Math.min(
        cipherA.length,
        cipherB.length,
        knownB.length,
    )
    const recoveredBytes = new Uint8Array(recoveredBytesCount)

    for (let i = 0; i < recoveredBytesCount; i++) {
        recoveredBytes[i] = cipherA[i] ^ cipherB[i] ^ knownB[i]
    }

    return new TextDecoder().decode(recoveredBytes)
}

function ivToHex(iv: Uint8Array): string {
    return Array.from(iv)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
}

describe('crypto store IV reuse (AES-GCM)', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    suite('distinct IV per field', () => {
        it('passes a fresh IV to every field encryption', async () => {
            const encryptSpy = vi.spyOn(webCrypto, 'encrypt')
            const cryptoStore = useCryptoStore()
            const group = fakeGroup({ isPrivate: true, links: [fakeLink()] })

            await cryptoStore.encryptGroup(group, 'password')

            // One link with url + title + favIconUrl = 3 encrypt calls
            expect(encryptSpy).toHaveBeenCalledTimes(3)

            // Collect IVs from each entrypt() function call
            const ivs = encryptSpy.mock.calls.map(args =>
                // 2 is the index of an argument in encrypt() function
                ivToHex(args[2] as Uint8Array),
            )

            expect(new Set(ivs).size).toEqual(ivs.length)
        })

        it('encrypts identical texts to different ciphers', async () => {
            const cryptoStore = useCryptoStore()
            const same = 'https://same-value.example/reused'

            const group = fakeGroup({
                isPrivate: true,
                links: [fakeLink({ url: same, title: same })],
            })

            const encrypted = await cryptoStore.encryptGroup(group, 'password')
            const link = encrypted.links[0]

            // Same key + same IV is deterministic, so equal outputs
            // prove keystream reuse. Fresh IVs per field must differ
            expect(link.url).not.toEqual(link.title)
        })
    })

    suite('known-plaintext recovery without password/key', () => {
        it('does not leak the URL prefix via favicon cipher', async () => {
            const cryptoStore = useCryptoStore()
            const url = 'https://example.com/articles/how-to-secure-tabs-12345'
            const favIconUrl = 'https://example.com/favicon.ico'

            const group = fakeGroup({
                isPrivate: true,
                links: [fakeLink({ url, title: 'Some title', favIconUrl })],
            })

            const encrypted = await cryptoStore.encryptGroup(group, 'password')
            const link = encrypted.links[0]

            // Will look like https://example.com/articles/ho
            const leakedPrefix = url.slice(
                0,
                new TextEncoder().encode(favIconUrl).length,
            )

            const recovered = recoverPrefix(link.url, link.favIconUrl, favIconUrl)

            expect(recovered).not.toEqual(leakedPrefix)
        })
    })
})
