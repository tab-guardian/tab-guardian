// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { generateGroupId } from '@common/modules/group'

describe('group utils module', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('generateGroupId()', () => {
        it('generates random number', () => {
            const num1 = generateGroupId()
            const num2 = generateGroupId()

            expect(num1).toBeTypeOf('number')
            expect(num2).toBeTypeOf('number')
            expect(num1).not.equal(num2)
        })
    })
})
