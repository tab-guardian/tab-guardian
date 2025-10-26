// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { removeTrail, trans } from '@common/modules'
import { config } from '@common/config'

describe('modules/index utils module', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    it('trans() changes locale key to text', () => {
        expect(trans('yes')).toBeOneOf(['Yes', 'Да', '是'])
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
})
