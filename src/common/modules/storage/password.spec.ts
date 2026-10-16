// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { KEY_PREFIX, passwordStorage } from '@common/modules/storage/password'

describe('password storage module', () => {
    beforeEach(() => {
        localStorage.clear()
        sessionStorage.clear()
        setActivePinia(createPinia())
    })

    suite('save()', () => {
        it('saves and returns password', async () => {
            await passwordStorage.save(1, 'kokomi-is-hydro')
            expect(await passwordStorage.get(1)).toEqual('kokomi-is-hydro')
        })

        it('never writes to persistent storage', async () => {
            await passwordStorage.save(1, 'barbara-heals')
            expect(localStorage.getItem(KEY_PREFIX + '1')).toBeNull()
        })

        it('ignores empty password', async () => {
            await passwordStorage.save(3, '')
            expect(await passwordStorage.get(3)).toBeNull()
        })
    })

    suite('delete()', () => {
        it('removes saved password', async () => {
            await passwordStorage.save(1, 'skirk-damage')
            await passwordStorage.delete(1)

            expect(await passwordStorage.get(1)).toBeNull()
        })
    })
})
