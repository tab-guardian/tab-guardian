// @vitest-environment happy-dom

import type { Pinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { trans } from '@common/modules'
import { showToast } from '@common/modules/toast'
import { fakeGroup } from '@common/modules/fake'
import { passwordStorage } from '@common/modules/storage/password'
import {
    createLockedGroup,
    useFreshPinia,
    waitUntil,
} from '@common/modules/testUtils'
import { useGroupStore } from '@/stores/group'
import { useModalStore } from '@/stores/modal'
import RemoveUrlLockModal from '@/components/Modals/Group/RemoveUrlLockModal.vue'

vi.mock('@common/modules/toast', () => ({
    showToast: vi.fn(),
}))

function mountModal(pinia: Pinia): ReturnType<typeof mount> {
    return mount(RemoveUrlLockModal, {
        global: { plugins: [pinia] },
    })
}

async function submitCredentials(
    wrapper: ReturnType<typeof mount>,
    name: string,
    pass: string,
): Promise<void> {
    await wrapper.find('#text-field-value').setValue(name)
    await wrapper.find('#enter-password').setValue(pass)
    await wrapper.find('form').trigger('submit')
}

describe('RemoveUrlLockModal', () => {
    beforeEach(() => {
        localStorage.clear()
        sessionStorage.clear()
        vi.clearAllMocks()
    })

    it('removes url lock and closes the modal', async () => {
        const pinia = useFreshPinia()
        const groupStore = useGroupStore()
        const modalStore = useModalStore()

        await createLockedGroup(
            { name: 'work', bindUrl: 'hashed-url' },
            'correct-password',
        )

        void modalStore.show('removeUrlLock', {})

        const wrapper = mountModal(pinia)
        await submitCredentials(wrapper, 'work', 'correct-password')

        await waitUntil(() => {
            const group = groupStore.getNamed('work')
            expect(group?.bindUrl).toBeUndefined()
        })

        expect(showToast).toHaveBeenCalledWith({
            text: trans('bind_url_removed'),
        })

        expect(modalStore.isModalVisible('removeUrlLock')).toBeFalsy()

        wrapper.unmount()
    })

    it('removes url lock from an unlocked group without encrypting it', async () => {
        const pinia = useFreshPinia()
        const groupStore = useGroupStore()
        const modalStore = useModalStore()

        await groupStore.create(
            fakeGroup({ name: 'work', isPrivate: true, bindUrl: 'hashed-url' }),
        )

        void modalStore.show('removeUrlLock', {})

        const wrapper = mountModal(pinia)
        await waitUntil(() => expect(groupStore.loading).toBeFalsy())
        await submitCredentials(wrapper, 'work', '')

        await waitUntil(() => {
            expect(groupStore.getNamed('work')?.bindUrl).toBeUndefined()
            expect(showToast).toHaveBeenCalledWith({
                text: trans('bind_url_removed'),
            })
        })

        const group = groupStore.getNamed('work')

        expect(group!.bindUrl).toBeUndefined()
        expect(group!.isEncrypted).toBeFalsy()
        expect(modalStore.isModalVisible('removeUrlLock')).toBeFalsy()

        wrapper.unmount()
    })

    it('rejects a password that does not match the remembered one', async () => {
        const pinia = useFreshPinia()
        const groupStore = useGroupStore()
        const modalStore = useModalStore()

        await groupStore.create(
            fakeGroup({ name: 'work', isPrivate: true, bindUrl: 'hashed-url' }),
        )

        const group = groupStore.getNamed('work')!
        await passwordStorage.save(group.id, 'remembered-password')

        void modalStore.show('removeUrlLock', {})

        const wrapper = mountModal(pinia)
        await waitUntil(() => expect(groupStore.loading).toBeFalsy())
        await submitCredentials(wrapper, 'work', 'wrong-password')

        await waitUntil(() => {
            expect(showToast).toHaveBeenCalledWith({
                text: trans('group_with_credentials_not_found'),
                type: 'error',
            })
        })

        expect(groupStore.getNamed('work')?.bindUrl).toEqual('hashed-url')
        expect(modalStore.isModalVisible('removeUrlLock')).toBeTruthy()

        wrapper.unmount()
    })

    it('shows an error when group is not found', async () => {
        const pinia = useFreshPinia()
        const modalStore = useModalStore()

        void modalStore.show('removeUrlLock', {})

        const wrapper = mountModal(pinia)
        await submitCredentials(wrapper, 'missing', 'some-password')

        await waitUntil(() => {
            expect(showToast).toHaveBeenCalledWith({
                text: trans('group_with_credentials_not_found'),
                type: 'error',
            })
        })

        expect(modalStore.isModalVisible('removeUrlLock')).toBeTruthy()

        wrapper.unmount()
    })

    it('shows an error when password is wrong', async () => {
        const pinia = useFreshPinia()
        const groupStore = useGroupStore()
        const modalStore = useModalStore()

        await createLockedGroup(
            { name: 'work', bindUrl: 'hashed-url' },
            'correct-password',
        )

        void modalStore.show('removeUrlLock', {})

        const wrapper = mountModal(pinia)
        await submitCredentials(wrapper, 'work', 'wrong-password')

        await waitUntil(() => {
            expect(showToast).toHaveBeenCalledWith({
                text: trans('group_with_credentials_not_found'),
                type: 'error',
            })
        })

        expect(groupStore.getNamed('work')?.bindUrl).toBe('hashed-url')
        expect(modalStore.isModalVisible('removeUrlLock')).toBeTruthy()

        wrapper.unmount()
    })
})
