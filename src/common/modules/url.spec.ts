// @vitest-environment happy-dom

import type { RuntimeType } from '@common/types/runtime'
import type { Mock } from 'vitest'
import { describe, it, expect, suite, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import {
    getCurrentUrl,
    getHashedCurrentUrl,
    hashUrl,
    isImageUrl,
    isForbiddenUrl,
} from '@common/modules/url'
import { fakeInvalidImageUrls, fakeValidImageUrls } from './fake'
import * as RuntimeUtils from '@common/modules/runtime/utils'

describe('url utilities module', () => {
    let isRuntimeSpy: Mock

    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())

        isRuntimeSpy = vi.spyOn(RuntimeUtils, 'isRuntime')

        // Reset mocks
        isRuntimeSpy.mockReset()
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

    it('getCurrentUrl() returns current URL', async () => {
        const url = await getCurrentUrl()
        expect(url).equal('http://localhost:3000/')
    })

    it('getHashedCurrentUrl() returns current hashed URL', async () => {
        const url = await getHashedCurrentUrl()
        const hash = await hashUrl('http://localhost:3000/')
        expect(url).equal(hash)
    })

    suite('isImageUrl()', () => {
        it('returns true when input is a valid image URL', () => {
            for (const url of fakeValidImageUrls()) {
                expect(isImageUrl(url), `${url} must be valid`).toBeTruthy()
            }
        })

        it('returns false when input is an invalid image URL', () => {
            for (const url of fakeInvalidImageUrls()) {
                expect(isImageUrl(url), `${url} must be invalid`).toBeFalsy()
            }
        })
    })

    suite('isForbiddenUrl()', () => {
        it('returns false because the runtime is not firefox', () => {
            const res = isForbiddenUrl('https://duckduckgo.com/')
            expect(res).toBeFalsy()
        })

        it('approves URLs in chrome runtime', () => {
            // Chrome runtime
            isRuntimeSpy.mockImplementation((arg: RuntimeType) => arg === 'chrome')

            const urls = [
                'about:config',
                'chrome://extensions',
                'https://example.com',
                'about:blank', // about:blank is never forbidden
            ]

            urls.forEach(url => {
                const res = isForbiddenUrl(url)
                expect(res).toBeFalsy()
            })
        })

        it('does not approve forbidden URLs in firefox runtime', () => {
            // Firefox runtime
            isRuntimeSpy.mockImplementation((arg: RuntimeType) => arg === 'firefox')

            const urls = ['about:config', 'chrome://extensions']

            urls.forEach(url => {
                const res = isForbiddenUrl(url)
                expect(res).toBeTruthy()
            })
        })

        it('approve non-forbidden URLs in firefox runtime', () => {
            // Firefox runtime
            isRuntimeSpy.mockImplementation((arg: RuntimeType) => arg === 'firefox')

            const urls = ['about:addons', 'chrome://settings']

            urls.forEach(url => {
                const res = isForbiddenUrl(url)
                expect(res).toBeTruthy()
            })
        })
    })
})
