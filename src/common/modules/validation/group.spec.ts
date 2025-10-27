// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { trans } from '@common/modules'
import { validatePassword } from '@common/modules/validation/group'
import { config } from '@common/config'

describe('group validation module', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('validatePassword()', () => {
        it('returns error for empty password', () => {
            const err = validatePassword('')
            expect(err).equal(trans('pass_empty'))
        })

        it('returns error for short password', () => {
            const err = validatePassword('adams')
            expect(err).equal(
                trans('password_min_length', config.MIN_PASS_LENGTH.toString()),
            )
        })

        it('returns error for not matched passwords', () => {
            const err = validatePassword('amy-adams', 'amy-adam')
            expect(err).equal(trans('passwords_not_match'))
        })

        it('returns null for matched passwords', () => {
            const err = validatePassword('amy-adams', 'amy-adams')
            expect(err).toBeNull()
        })

        it('returns null regular password', () => {
            const err = validatePassword('amy is the best')
            expect(err).toBeNull()
        })
    })
})
