// @vitest-environment happy-dom

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { config } from '@common/config'
import { trans } from '@common/modules'
import { useFreshPinia } from '@common/modules/testUtils'
import { useModalStore } from '@/stores/modal'
import NewPasswordModal from '@/components/Modals/NewPasswordModal.vue'

function mountModal(): ReturnType<typeof mount> {
    const pinia = useFreshPinia()
    const modalStore = useModalStore()

    void modalStore.show('newPassword', {})

    return mount(NewPasswordModal, {
        global: { plugins: [pinia] },
    })
}

async function fillPasswords(
    wrapper: ReturnType<typeof mount>,
    password: string,
    confirmPassword = password,
): Promise<void> {
    const passInput = wrapper.find('#group-password')
    const confirmInput = wrapper.find('#group-confirm-password')

    await passInput.setValue(password)
    await passInput.trigger('keyup')

    await confirmInput.setValue(confirmPassword)
    await confirmInput.trigger('keyup')
}

describe('NewPasswordModal', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('disables submit when passwords mismatch after an input-only change', async () => {
        const wrapper = mountModal()

        await fillPasswords(wrapper, 'strong-password')

        const submit = wrapper.find('button[type="submit"]')

        expect(wrapper.text()).not.toContain(trans('passwords_not_match'))
        expect(submit.attributes('disabled')).toBeUndefined()

        // Simulates paste, autofill, or drag and drop: input event without keyup
        await wrapper.find('#group-confirm-password').setValue('another-password')

        expect(wrapper.text()).toContain(trans('passwords_not_match'))
        expect(submit.attributes('disabled')).toBeDefined()
    })

    it('keeps the modal open when submitting mismatched passwords', async () => {
        const wrapper = mountModal()
        const modalStore = useModalStore()

        await fillPasswords(wrapper, 'strong-password')

        // Simulates paste, autofill, or drag and drop: input event without keyup
        await wrapper.find('#group-confirm-password').setValue('another-password')
        await wrapper.find('form').trigger('submit')

        expect(modalStore.isModalVisible('newPassword')).toBeTruthy()
    })

    it('disables submit when passwords differ', async () => {
        const wrapper = mountModal()
        const submit = wrapper.find('button[type="submit"]')

        await fillPasswords(wrapper, 'strong-password', 'another-password')

        expect(wrapper.text()).toContain(trans('passwords_not_match'))
        expect(submit.attributes('disabled')).toBeDefined()
    })

    it('disables submit when password is shorter than the minimum length', async () => {
        const wrapper = mountModal()
        const submit = wrapper.find('button[type="submit"]')

        await fillPasswords(wrapper, 'a'.repeat(config.MIN_PASS_LENGTH - 1))

        expect(submit.attributes('disabled')).toBeDefined()
        expect(wrapper.text()).toContain(
            trans('password_min_length', config.MIN_PASS_LENGTH.toString()),
        )
    })

    it('disables submit when passwords become too short after an input-only change', async () => {
        const wrapper = mountModal()
        const shortPassword = 'a'.repeat(config.MIN_PASS_LENGTH - 1)
        const submit = wrapper.find('button[type="submit"]')

        await fillPasswords(wrapper, 'strong-password')

        // Simulates paste, autofill, or drag and drop: input event without keyup
        await wrapper.find('#group-password').setValue(shortPassword)
        await wrapper.find('#group-confirm-password').setValue(shortPassword)

        expect(wrapper.text()).not.toContain(trans('passwords_not_match'))
        expect(submit.attributes('disabled')).toBeDefined()
        expect(wrapper.text()).toContain(
            trans('password_min_length', config.MIN_PASS_LENGTH.toString()),
        )
    })

    it('enables submit when a mismatch is fixed with an input-only change', async () => {
        const wrapper = mountModal()
        const confirmInput = wrapper.find('#group-confirm-password')
        const submit = wrapper.find('button[type="submit"]')

        await fillPasswords(wrapper, 'strong-password')

        // Simulates paste, autofill, or drag and drop: input event without keyup
        await confirmInput.setValue('another-password')

        expect(wrapper.text()).toContain(trans('passwords_not_match'))
        expect(submit.attributes('disabled')).toBeDefined()

        await confirmInput.setValue('strong-password')

        expect(wrapper.text()).not.toContain(trans('passwords_not_match'))
        expect(submit.attributes('disabled')).toBeUndefined()
    })

    it('submits matching passwords and returns the password', async () => {
        const pinia = useFreshPinia()
        const modalStore = useModalStore()
        const modalResult = modalStore.show('newPassword', {})
        const wrapper = mount(NewPasswordModal, {
            global: { plugins: [pinia] },
        })

        await fillPasswords(wrapper, 'strong-password')
        await wrapper.find('form').trigger('submit')

        await expect(modalResult).resolves.toEqual({
            newPass: 'strong-password',
        })

        expect(modalStore.isModalVisible('newPassword')).toBeFalsy()
    })
})
