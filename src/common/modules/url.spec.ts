// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { hashUrl } from '@common/modules/url'

describe('url', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('hashUrl()', () => {
        it('hashes the provided URL', async () => {
            const url = 'https://ya.ru'
            const hashed = await hashUrl(url)
            expect(hashed).not.equal(url)
        })

        it('trims the last forward slash', async () => {
            const withSlash = await hashUrl('https://duckduckgo.com/')
            const withoutSlash = await hashUrl('https://duckduckgo.com')
            expect(withSlash).equal(withoutSlash)
        })

        it('returns 32 bytes string in hex with length 64', async () => {
            const hashed1 = await hashUrl('https://duckduckgo.com/')
            expect(hashed1.length).to.equal(64)

            const hashed2 = await hashUrl('https://uknown.com')
            expect(hashed2.length).to.equal(64)
        })
    })
})
