// @vitest-environment happy-dom

import type { Group } from '@common/types'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { fakeGroup, fakeLinks } from '@common/modules/fake'
import { restoreTabs } from '@common/modules/tabs/restoreTabs'
import { passwordStorage } from '@common/modules/storage/password'
import { waitUntil } from '@common/modules/testUtils'
import { useGroupStore } from '@/stores/group'
import { useModalStore } from '@/stores/modal'
import { useSettingsStore } from '@/stores/settings'
import { useOpenGroup } from '@/composables/useOpenGroup'

const { push } = vi.hoisted(() => ({ push: vi.fn() }))

vi.mock('vue-router', () => ({
    useRouter: () => ({ push }),
}))

vi.mock('@common/modules/tabs/restoreTabs', () => ({
    restoreTabs: vi.fn(),
}))

vi.mock('@common/modules/toast', () => ({
    showToast: vi.fn(),
}))

const groupPass = 'amy-pass'

async function createLockedGroup(): Promise<Group> {
    const result = await useGroupStore().lock(
        fakeGroup({ isPrivate: true, links: fakeLinks(2) }),
        groupPass,
    )

    return result.group!
}

describe('useOpenGroup', () => {
    beforeEach(() => {
        localStorage.clear()
        sessionStorage.clear()
        setActivePinia(createPinia())
        useSettingsStore().resetToDefaults()
        vi.mocked(restoreTabs).mockResolvedValue([])
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('opens an already unlocked private group without a password prompt', async () => {
        const groupStore = useGroupStore()
        const modalStore = useModalStore()
        const { open } = useOpenGroup()
        const group = fakeGroup({ isPrivate: true, links: fakeLinks(2) })
        const unlockSpy = vi.spyOn(groupStore, 'unlock')

        await groupStore.create(group)
        await passwordStorage.save(group.id, groupPass)

        await open(group)

        expect(modalStore.isModalVisible('password')).toBe(false)
        expect(unlockSpy).not.toHaveBeenCalled()
        expect(restoreTabs).toHaveBeenCalledWith(group.links)
        expect(push).not.toHaveBeenCalled()
    })

    it('asks for the password before opening tabs of a locked group', async () => {
        const modalStore = useModalStore()
        const { open } = useOpenGroup()
        const lockedGroup = await createLockedGroup()

        const opening = open(lockedGroup)

        await waitUntil(() => {
            expect(modalStore.isModalVisible('password')).toBe(true)
        })

        expect(restoreTabs).not.toHaveBeenCalled()

        modalStore.hide('password', {})
        await opening
    })

    it('opens tabs, re-locks and goes to main after a correct password', async () => {
        const groupStore = useGroupStore()
        const modalStore = useModalStore()
        const { open } = useOpenGroup()
        const lockedGroup = await createLockedGroup()

        const opening = open(lockedGroup)

        await waitUntil(() => {
            expect(modalStore.isModalVisible('password')).toBe(true)
        })

        const data = modalStore.getSharedData('password')!

        expect(await data.decrypting(groupPass)).toBe(true)

        modalStore.hide('password', {})
        await opening

        expect(restoreTabs).toHaveBeenCalled()
        expect(push).toHaveBeenCalledWith({ name: 'main' })
        expect(groupStore.get(lockedGroup.id)?.isEncrypted).toBe(true)
    })

    it('does not open tabs on a wrong password', async () => {
        const modalStore = useModalStore()
        const { open } = useOpenGroup()
        const lockedGroup = await createLockedGroup()

        const opening = open(lockedGroup)

        await waitUntil(() => {
            expect(modalStore.isModalVisible('password')).toBe(true)
        })

        const data = modalStore.getSharedData('password')!

        expect(await data.decrypting('wrong-pass')).toBe(false)

        modalStore.hide('password', {})
        await opening

        expect(restoreTabs).not.toHaveBeenCalled()
        expect(push).not.toHaveBeenCalled()
    })

    it('does not open tabs when the password prompt is cancelled', async () => {
        const modalStore = useModalStore()
        const { open } = useOpenGroup()
        const lockedGroup = await createLockedGroup()

        const opening = open(lockedGroup)

        await waitUntil(() => {
            expect(modalStore.isModalVisible('password')).toBe(true)
        })

        modalStore.hide('password', {})
        await opening

        expect(restoreTabs).not.toHaveBeenCalled()
        expect(push).not.toHaveBeenCalled()
    })

    it('opens a public group directly', async () => {
        const groupStore = useGroupStore()
        const modalStore = useModalStore()
        const { open } = useOpenGroup()
        const group = fakeGroup({ links: fakeLinks(2) })

        await groupStore.create(group)
        await open(group)

        expect(modalStore.isModalVisible('password')).toBe(false)
        expect(restoreTabs).toHaveBeenCalledWith(group.links)
        expect(push).not.toHaveBeenCalled()
    })
})
