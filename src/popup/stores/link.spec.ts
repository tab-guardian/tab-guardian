// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, suite } from 'vitest'
import { useLinkStore } from '@/stores/link'
import { createPinia, setActivePinia } from 'pinia'

describe('linkStore', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('isEmptyBuffer', () => {
        it('is empty by default', () => {
            const store = useLinkStore()
            expect(store.isEmptyBuffer).toBeTruthy()
        })
    })
})
