// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { KEY_PREFIX, passwordStorage } from '@common/modules/storage/password'

describe('password storage module', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('save()', () => {
        it('saves group id to storage', async () => {
            await passwordStorage.save(1, 'anna-korot')
            const itemStr = localStorage.getItem(KEY_PREFIX + '1')
            expect(itemStr).equal('"anna-korot"')
        })

        it('ignores empty password', async () => {
            await passwordStorage.save(3, '')
            const itemStr = localStorage.getItem(KEY_PREFIX + '3')
            expect(itemStr).toBeNull()
        })
    })
})
