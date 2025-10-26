// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import {
    formatNumber,
    isEmoji,
    limitString,
    removeTrail,
    trans,
} from '@common/modules'

describe('modules/index utils module', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('trans()', () => {
        it('changes locale key to text', () => {
            expect(trans('yes')).toBeOneOf(['Yes', 'Да', '是'])
        })
    })

    suite('removeTrail()', () => {
        it('removes tail from the end of the string', () => {
            const res = removeTrail('Anna Korotchaeva_', '_')
            expect(res).equal('Anna Korotchaeva')
        })

        it('does not do anything when there is no tail', () => {
            const res = removeTrail('Anna Korotchaeva', '_')
            expect(res).equal('Anna Korotchaeva')
        })

        it('tail can be empty', () => {
            const res = removeTrail('Anna ', '')
            expect(res).equal('Anna ')
        })

        it('does not do anything for empty string', () => {
            expect(removeTrail('', '')).equal('')
            expect(removeTrail('', '/')).equal('')
            expect(removeTrail('', '_')).equal('')
        })
    })

    suite('limitString()', () => {
        it('limits string', () => {
            const res = limitString('Anna Korotchaeva', 4)
            expect(res).equal('Anna...')
        })

        it('returns empty string for empty string', () => {
            const res = limitString('', 0)
            expect(res).equal('')
        })

        it('does not add dots up to 3 characters', () => {
            expect(limitString('a', 0)).equal('a')
            expect(limitString('ab', 0)).equal('ab')
            expect(limitString('abc', 0)).equal('abc')
        })
    })

    suite('formatNumber()', () => {
        it('make number pretty', () => {
            expect(formatNumber(0)).equal('0')
            expect(formatNumber(10)).equal('10')
            expect(formatNumber(100)).equal('100')
            expect(formatNumber(1000)).equal('1,000')
            expect(formatNumber(10000)).equal('10,000')
            expect(formatNumber(123456)).equal('123,456')
            expect(formatNumber(1000001)).equal('1,000,001')
            expect(formatNumber(1000001009)).equal('1,000,001,009')
        })
    })

    suite('isEmoji()', () => {
        it('returns true for 👎️👍️ up emojis', () => {
            expect(isEmoji('👎️')).toBeTruthy()
            expect(isEmoji('👍️')).toBeTruthy()
        })

        it('returns false for multiple emojis', () => {
            expect(isEmoji('👎️❤️')).toBeFalsy()
        })

        it('returns false for non-emojis', () => {
            expect(isEmoji('x')).toBeFalsy()
            expect(isEmoji('a')).toBeFalsy()
            expect(isEmoji('.')).toBeFalsy()
            expect(isEmoji('nc')).toBeFalsy()
        })
    })
})
