// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

describe('folder store', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })
})
