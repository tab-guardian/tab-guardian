// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { config } from '@common/config'
import { mount } from '@vue/test-utils'
import NameInput from '@common/components/Form/NameInput.vue'

describe('NameInput', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    it('emits has-error event when name is too long', async () => {
        const wrapper = mount(NameInput, { modelValue: 'Ana de Armas' })
        const input = wrapper.find('#group-name')

        expect(input).not.toBeNull()

        const longName = 'a'.repeat(config.MAX_GROUP_NAME_LENGTH + 1)

        await input.setValue(longName)
        await input.trigger('keyup')

        expect(wrapper.emitted('has-error')).toBeTruthy()
        expect(wrapper.emitted('has-error')![0]).toEqual([true])
    })
})
