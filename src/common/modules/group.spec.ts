// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import {
    generateId,
    isComponentIcon,
    filterForbittenLinks,
} from '@common/modules/group'
import { fakeLink } from '@common/modules/fake'

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

    suite('isComponentIcon()', () => {
        it('returns true when input string ends with Icon', () => {
            const result = isComponentIcon('BugoniaIcon')
            expect(result).toBeTruthy()
        })

        it('returns false when input string missing Icon from end', () => {
            const result = isComponentIcon('BugoniaIconMovie')
            expect(result).toBeFalsy()
        })

        it('returns false for empty string', () => {
            expect(isComponentIcon('')).toBeFalsy()
        })

        it('returns false if string 4 or less characters', () => {
            expect(isComponentIcon('Icon')).toBeFalsy()
            expect(isComponentIcon('Ico')).toBeFalsy()
            expect(isComponentIcon('Ic')).toBeFalsy()
            expect(isComponentIcon('I')).toBeFalsy()
        })

        it('returns true for 5 character input', () => {
            expect(isComponentIcon('XIcon')).toBeTruthy()
        })
    })

    suite('filterForbittenLinks()', () => {
        it('does not filter links because it works only for firefox extensions', () => {
            const links = [
                fakeLink({ url: 'about:config' }),
                fakeLink({ url: 'htt:/nice' }),
                fakeLink({ url: 'sdfkldjfkdlsfjlk' }),
            ]

            const res = filterForbittenLinks(links)

            expect(res).toHaveLength(3)
        })
    })
})
