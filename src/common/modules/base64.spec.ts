// @vitest-environment happy-dom

import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { fromBase64, toBase64 } from '@common/modules/base64'

describe('base64 modules', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    it('converts text to base64 and back', () => {
        const initialText = 'Amy ❤️ Адамс is cool'
        const base64 = toBase64(new TextEncoder().encode(initialText))

        expect(base64).not.equal(initialText)

        const originalText = new TextDecoder().decode(fromBase64(base64))

        expect(originalText).equal(initialText)
    })
})
