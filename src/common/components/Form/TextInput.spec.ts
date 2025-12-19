// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { config } from '@common/config'
import { mount } from '@vue/test-utils'
import TextInput from '@common/components/Form/TextInput.vue'

describe('TextInput', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    it.each([
        ['false for undefined name', undefined, false],
        ['false for null name', null, false],
        ['false for empty name', '', false],
        ['false for short name', 'Hi', false],
        ['false for exact length', 'a'.repeat(config.MAX_NAME_LENGTH), false],
        ['true  for long name', 'a'.repeat(config.MAX_NAME_LENGTH + 1), true],
    ])('emits has-error with %s', async (_, name, expected) => {
        const wrapper = mount(TextInput)
        const input = wrapper.find('#text-field-value')

        await input.setValue(name)
        await input.trigger('keyup')

        expect(wrapper.emitted('has-error')).toBeTruthy()
        expect(wrapper.emitted('has-error')!.at(-1)).toEqual([expected])
    })

    it('emits loaded event when loaded', async () => {
        const wrapper = mount(TextInput)
        const input = wrapper.find('#text-field-value')

        await input.setValue('some name is here')

        expect(input).not.toBeNull()
        expect(wrapper.emitted('loaded')).toBeTruthy()
    })
})
