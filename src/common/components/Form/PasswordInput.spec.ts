// @vitest-environment happy-dom

import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { config } from '@common/config'
import { trans } from '@common/modules'
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

    it.each([
        ['false for undefined password', undefined, false],
        ['false for null password', null, false],
        ['false for empty password', '', false],
        ['false for short password', 'pass', false],
        ['false for exact length', 'a'.repeat(config.MIN_PASS_LENGTH), false],
        ['false for long password', 'a'.repeat(config.MIN_PASS_LENGTH + 1), false],
    ])(
        'emits has-error without withMinLength prop with %s',
        async (_, password, expected) => {
            const wrapper = mount(PasswordInput, {
                props: { label: 'Password', id: 'password' },
            })

            const input = wrapper.find('#password')

            if (typeof password !== 'undefined') {
                await input.setValue(password)
            }

            await input.trigger('keyup')

            expect(wrapper.emitted('has-error')).toBeTruthy()
            expect(wrapper.emitted('has-error')!.at(-1)).toEqual([expected])
        },
    )

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

    it.each([
        ['empty string when password is undefined', undefined, ''],
        ['empty string when password is null', null, ''],
        [
            'error when password is short',
            'amy',
            trans('password_min_length', config.MIN_PASS_LENGTH.toString()),
        ],
        [
            'empty string when password is exact length',
            'a'.repeat(config.MIN_PASS_LENGTH),
            '',
        ],
        [
            'empty string when password is long',
            'a'.repeat(config.MIN_PASS_LENGTH + 1),
            '',
        ],
    ])('contains passErr with %s', async (_, password, expected) => {
        const wrapper = mount(PasswordInput, {
            props: {
                label: 'Password',
                id: 'password',
                withMinLength: true,
            },
        })

        const input = wrapper.find('#password')

        if (typeof password !== 'undefined') {
            await input.setValue(password)
        }

        await input.trigger('keyup')

        // @ts-ignore
        expect(wrapper.vm.passErr!).equal(expected)
    })
})
