// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useFreshPinia, waitUntil } from '@common/modules/testUtils'
import { useModalStore } from '@/stores/modal'
import Progress from '@common/components/Progress.vue'
import PasswordModal from '@/components/Modals/PasswordModal.vue'

describe('PasswordModal', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('stops loading when decrypting fails', async () => {
        const pinia = useFreshPinia()
        const modalStore = useModalStore()

        let rejectDecrypting!: (error: Error) => void

        const decrypting = vi.fn(() => {
            return new Promise<boolean>((_, reject) => {
                rejectDecrypting = reject
            })
        })

        void modalStore.show('password', { text: 'Enter pass', decrypting })

        const wrapper = mount(PasswordModal, {
            global: { plugins: [pinia] },
        })

        await wrapper.find('#enter-password').setValue('amy-pass')
        await wrapper.find('form').trigger('submit')

        await waitUntil(() => {
            expect(wrapper.findComponent(Progress).exists()).toBeTruthy()
        })

        rejectDecrypting(new Error('Cannot open tab'))

        await waitUntil(() => {
            expect(wrapper.findComponent(Progress).exists()).toBeFalsy()
        })
    })
})
