// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { generateId } from '@common/modules/group'

describe('group utils module', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('generateId()', () => {
        it('generates random number', () => {
            const num1 = generateId()
            const num2 = generateId()

            expect(num1).toBeTypeOf('number')
            expect(num2).toBeTypeOf('number')
            expect(num1).not.equal(num2)
        })
    })
})
