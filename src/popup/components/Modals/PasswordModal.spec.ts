// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { PasswordAttemptResult } from '@common/types/modal'
import { useFreshPinia, waitUntil } from '@common/modules/testUtils'
import { showToast } from '@common/modules/toast'
import { useModalStore } from '@/stores/modal'
import Progress from '@common/components/Progress.vue'
import PasswordModal from '@/components/Modals/PasswordModal.vue'

vi.mock('@common/modules/toast', () => ({
    showToast: vi.fn(),
}))

describe('PasswordModal', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.clearAllMocks()
    })

    it('stops loading when decrypting fails', async () => {
        const pinia = useFreshPinia()
        const modalStore = useModalStore()

        let rejectDecrypting!: (error: Error) => void

        const decrypting = vi.fn(() => {
            return new Promise<PasswordAttemptResult>((_, reject) => {
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

    it('shows the toast returned by decrypting', async () => {
        const pinia = useFreshPinia()
        const modalStore = useModalStore()
        const toastMsg = { text: 'Wrong password', type: 'error' } as const

        void modalStore.show('password', {
            text: 'Enter pass',
            decrypting: vi.fn(async () => ({
                success: false,
                toastMsg,
            })),
        })

        const wrapper = mount(PasswordModal, {
            global: { plugins: [pinia] },
        })

        await wrapper.find('#enter-password').setValue('bad-pass')
        await wrapper.find('form').trigger('submit')

        await waitUntil(() => {
            expect(showToast).toHaveBeenCalledWith(toastMsg)
        })
    })
})
