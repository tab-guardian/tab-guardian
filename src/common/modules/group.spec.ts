// @vitest-environment happy-dom

import type { Link } from '@common/types'
import type { Mock } from 'vitest'
import { describe, it, expect, suite, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import {
    generateId,
    isComponentIcon,
    filterForbiddenLinks,
} from '@common/modules/group'
import { fakeLink } from '@common/modules/fake'
import { setIsRuntimeTo } from '@common/modules/test-utils'
import * as RuntimeUtils from '@common/modules/runtime/utils'

describe('group utils module', () => {
    let isRuntimeSpy: Mock

    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())

        isRuntimeSpy = vi.spyOn(RuntimeUtils, 'isRuntime')
        isRuntimeSpy.mockReset()
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

    suite('filterForbiddenLinks()', () => {
        it('does not filter links in chrome runtime', () => {
            setIsRuntimeTo('chrome', isRuntimeSpy)

            const links = [
                fakeLink({ url: 'about:config' }),
                fakeLink({ url: 'chrome://extensions' }),
                fakeLink({ url: 'https://example.com' }),
                fakeLink({ url: 'about:blank' }), // about:blank is never forbidden
            ]

            const res = filterForbiddenLinks(links)

            expect(res.allowed).toHaveLength(4)
            expect(res.forbidden).toHaveLength(0)
        })

        it('filters forbidden links in firefox runtime', () => {
            setIsRuntimeTo('firefox', isRuntimeSpy)

            const links = [
                fakeLink({ url: 'about:config' }),
                fakeLink({ url: 'chrome://extensions' }),
                fakeLink({ url: 'https://example.com' }),
                fakeLink({ url: 'about:blank' }),
            ]

            const res = filterForbiddenLinks(links)

            expect(res.allowed).toHaveLength(2)
            expect(res.allowed[0].url).toBe('https://example.com')
            expect(res.allowed[1].url).toBe('about:blank')

            expect(res.forbidden).toHaveLength(2)
            expect(res.forbidden[0].url).toBe('about:config')
            expect(res.forbidden[1].url).toBe('chrome://extensions')
        })

        it('returns empty array if all links are forbidden in firefox runtime', () => {
            setIsRuntimeTo('firefox', isRuntimeSpy)

            const links = [
                fakeLink({ url: 'about:addons' }),
                fakeLink({ url: 'chrome://settings' }),
            ]

            const res = filterForbiddenLinks(links)

            expect(res.allowed).toHaveLength(0)
            expect(res.forbidden).toHaveLength(2)
        })

        it('returns original links if no links are forbidden in firefox runtime', () => {
            setIsRuntimeTo('firefox', isRuntimeSpy)

            const links = [
                fakeLink({ url: 'https://google.com' }),
                fakeLink({ url: 'https://bing.com' }),
                fakeLink({ url: 'about:blank' }),
            ]

            const res = filterForbiddenLinks(links)

            expect(res.allowed).toHaveLength(3)
            expect(res.allowed[0].url).toBe('https://google.com')
            expect(res.allowed[1].url).toBe('https://bing.com')
            expect(res.allowed[2].url).toBe('about:blank')

            expect(res.forbidden).toHaveLength(0)
        })

        it('handles empty links array gracefully', () => {
            setIsRuntimeTo('firefox', isRuntimeSpy)

            const links: Link[] = []
            const res = filterForbiddenLinks(links)

            expect(res.allowed).toHaveLength(0)
            expect(res.forbidden).toHaveLength(0)
        })
    })
})
