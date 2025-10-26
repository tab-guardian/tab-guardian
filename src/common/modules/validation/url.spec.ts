// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { fakeInvalidImageUrls, fakeValidImageUrls } from '../fake'
import { validateImageUrl, validateUrl } from './url'

describe('url module', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('validateImageUrl()', () => {
        it('returns null for a valid image URL', () => {
            for (const url of fakeValidImageUrls()) {
                const err = validateImageUrl(url)
                expect(err).toBeNull()
            }
        })

        it('returns error message for an invalid image URL', () => {
            for (const url of fakeInvalidImageUrls()) {
                const err = validateImageUrl(url)
                expect(err).toBeTypeOf('string')
            }
        })
    })

    suite('validateUrl()', () => {
        it('returns true for a valid URL', () => {
            const urls = [
                'http://some-url',
                'https://duck.com/query',
                'http://t.io',
                'http://t.io/',
                'http://сайт.ру/',
            ]

            for (const url of urls) {
                const err = validateUrl(url)
                expect(err).toBeNull()
            }
        })

        it('returns false for an invalid URL', () => {
            const urls = [
                'ssh://some-url',
                '://some-url/here',
                '//test-url/nice',
                'http:://duckduckgo.com',
                'http:///duckduckgo.com',
                'http://:duckduckgo.com',
                'http://-duckduckgo.com',
            ]

            for (const url of urls) {
                const err = validateUrl(url)
                expect(err).toBeTypeOf('string')
            }
        })
    })
})
