// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { config } from '@common/config'
import { mount } from '@vue/test-utils'
import PasswordInput from '@common/components/Form/PasswordInput.vue'

describe('PasswordInput', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    it.each([
        ['true for undefined password', undefined, true],
        ['true for null password', null, true],
        ['true for empty password', '', true],
        ['true for short password', 'pass', true],
        ['false for exact length', 'a'.repeat(config.MIN_PASS_LENGTH), false],
        ['false  for long password', 'a'.repeat(config.MIN_PASS_LENGTH + 1), false],
    ])('emits has-error with %s', async (_, password, expected) => {
        const wrapper = mount(PasswordInput, {
            props: {
                label: 'Password',
                id: 'password',
                withMinLength: true,
                modelValue: password,
            },
        })

        const input = wrapper.find('#password')

        if (typeof password !== 'undefined') {
            await input.setValue(password)
        }

        await input.trigger('keyup')

        expect(wrapper.emitted('has-error')).toBeTruthy()
        expect(wrapper.emitted('has-error')!.at(-1)).toEqual([expected])
    })

    it('emits loaded event when loaded', async () => {
        const wrapper = mount(PasswordInput, {
            props: {
                label: 'Password',
                id: 'password',
            },
        })

        const input = wrapper.find('#password')
        await input.setValue('my-password')

        expect(input).not.toBeNull()
        expect(wrapper.emitted('loaded')).toBeTruthy()
    })

    it.each([
        ['true for null password', null, true],
        ['true for empty password', '', true],
        ['true for short password', 'amy', true],
        ['false for exact length', 'a'.repeat(config.MIN_PASS_LENGTH), false],
        ['false  for long password', 'a'.repeat(config.MIN_PASS_LENGTH + 1), false],
    ])('emits has-error onMounted with %s', async (_, password, expected) => {
        const wrapper = mount(PasswordInput, {
            props: {
                label: 'Password',
                id: 'password',
                withMinLength: true,
                modelValue: password,
            },
        })

        expect(wrapper.emitted('has-error')).toBeTruthy()
        expect(wrapper.emitted('has-error')![0]).toEqual([expected])
    })
})
