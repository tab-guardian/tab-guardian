// @vitest-environment happy-dom

import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '@/stores/app'
import { createPinia, setActivePinia } from 'pinia'

describe('app store', () => {
    beforeEach(() => setActivePinia(createPinia()))

    it('linkBuffer is null', () => {
        const store = useAppStore()
        expect(store.linkBuffer).toBeNull()
    })
})
