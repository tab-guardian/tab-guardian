// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, afterEach, suite, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { trans } from '@common/modules'
import { fakeGroup, fakeLink, fakeLinks } from '@common/modules/fake'
import { restoreTabs } from '@common/modules/tabs/restoreTabs'
import { showToast } from '@common/modules/toast'
import { passwordStorage } from '@common/modules/storage/password'
import { waitUntil } from '@common/modules/testUtils'
import { useGroupStore } from '@/stores/group'
import { useSettingsStore } from '@/stores/settings'
import { useModalStore } from '@/stores/modal'
import { useTabsStore } from '@/stores/tabs'

vi.mock('@common/modules/tabs/restoreTabs', () => ({
    restoreTabs: vi.fn(),
}))

vi.mock('@common/modules/toast', () => ({
    showToast: vi.fn(),
}))

describe('tabs store', () => {
    beforeEach(() => {
        localStorage.clear()
        sessionStorage.clear()
        setActivePinia(createPinia())
        vi.mocked(restoreTabs).mockResolvedValue([])
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    suite('openAndDeleteTabs()', () => {
        it('restores all group links', async () => {
            const groupStore = useGroupStore()
            const tabsStore = useTabsStore()
            const group = fakeGroup({ links: fakeLinks(2) })

            await groupStore.create(group)
            await tabsStore.openAndDeleteTabs(group)

            expect(restoreTabs).toHaveBeenCalledWith(group.links)
        })

        it('deletes group when every tab is restored', async () => {
            const groupStore = useGroupStore()
            const tabsStore = useTabsStore()
            const group = fakeGroup({ links: fakeLinks(2) })

            await groupStore.create(group)
            const message = await tabsStore.openAndDeleteTabs(group)

            expect(groupStore.get(group.id)).toBeNull()
            expect(message).toBeNull()
        })

        it('keeps group with only the failed links when some tabs fail', async () => {
            const groupStore = useGroupStore()
            const tabsStore = useTabsStore()
            const failedLink = fakeLink()
            const group = fakeGroup({ links: [fakeLink(), failedLink] })

            await groupStore.create(group)
            vi.mocked(restoreTabs).mockResolvedValue([failedLink])

            const message = await tabsStore.openAndDeleteTabs(group)
            const kept = groupStore.get(group.id)

            expect(kept).not.toBeNull()
            expect(kept?.links).toEqual([failedLink])
            expect(message).toBe(trans('only_some_tabs_restored', '1', '2'))
        })

        it('keeps the whole group when every tab fails', async () => {
            const groupStore = useGroupStore()
            const tabsStore = useTabsStore()
            const group = fakeGroup({ links: fakeLinks(2) })

            await groupStore.create(group)
            vi.mocked(restoreTabs).mockResolvedValue(group.links)

            const message = await tabsStore.openAndDeleteTabs(group)
            const kept = groupStore.get(group.id)

            expect(kept?.links).toHaveLength(2)
            expect(message).toBe(trans('only_some_tabs_restored', '0', '2'))
        })

        it('deletes cached password of a private group even when some tabs fail', async () => {
            const groupStore = useGroupStore()
            const tabsStore = useTabsStore()
            const group = fakeGroup({
                isPrivate: true,
                links: fakeLinks(2),
            })

            await groupStore.create(group)
            await passwordStorage.save(group.id, 'serhii-cho')

            vi.mocked(restoreTabs).mockResolvedValue([group.links[0]])

            await tabsStore.openAndDeleteTabs(group)

            expect(groupStore.get(group.id)).not.toBeNull()
            expect(await passwordStorage.get(group.id)).toBeNull()
        })
    })

    suite('openTabs()', () => {
        beforeEach(() => useSettingsStore().resetToDefaults())

        it('increments openedTimes when opening tabs', async () => {
            const groupStore = useGroupStore()
            const tabsStore = useTabsStore()
            const group = fakeGroup({ openedTimes: 3 })

            await groupStore.create(group)
            await tabsStore.openTabs(group)

            expect(groupStore.get(group.id)?.openedTimes).equal(4)
        })

        it('keeps the incremented openedTimes after re-locking', async () => {
            const groupStore = useGroupStore()
            const tabsStore = useTabsStore()

            const group = fakeGroup({ isPrivate: true, openedTimes: 3 })
            await groupStore.create(group)

            await tabsStore.openTabs(group, 'amy-pass')

            const locked = groupStore.get(group.id)

            expect(locked?.isEncrypted).toBeTruthy()
            expect(locked?.openedTimes).equal(4)
        })

        it('starts openedTimes at 1 when re-locking a group opened first time', async () => {
            const groupStore = useGroupStore()
            const tabsStore = useTabsStore()

            const group = fakeGroup({ isPrivate: true })
            await groupStore.create(group)

            await tabsStore.openTabs(group, 'genshin-skirk')

            expect(groupStore.get(group.id)?.openedTimes).equal(1)
        })

        it('asks for a password before opening any tab when none is cached', async () => {
            const groupStore = useGroupStore()
            const tabsStore = useTabsStore()
            const modalStore = useModalStore()
            const group = fakeGroup({ isPrivate: true, links: fakeLinks(2) })

            useSettingsStore().settings.rememberPasswordAfterUnlock = false

            await groupStore.create(group)

            const opening = tabsStore.openTabs(group)

            await waitUntil(() => {
                expect(modalStore.isModalVisible('newPassword')).toBeTruthy()
            })

            expect(restoreTabs).not.toHaveBeenCalled()

            modalStore.hide('newPassword', { newPass: 'amy-pass' })

            expect(await opening).toBeTruthy()
            expect(restoreTabs).toHaveBeenCalledWith(group.links)
        })

        it('does not open tabs when the password prompt is cancelled', async () => {
            const groupStore = useGroupStore()
            const tabsStore = useTabsStore()
            const modalStore = useModalStore()
            const group = fakeGroup({ isPrivate: true, links: fakeLinks(2) })

            useSettingsStore().settings.rememberPasswordAfterUnlock = false

            await groupStore.create(group)

            const opening = tabsStore.openTabs(group)

            await waitUntil(() => {
                expect(modalStore.isModalVisible('newPassword')).toBeTruthy()
            })

            modalStore.hide('newPassword', {})

            expect(await opening).toBeFalsy()
            expect(restoreTabs).not.toHaveBeenCalled()

            const kept = groupStore.get(group.id)
            expect(kept?.openedTimes).toBeUndefined()
        })

        it('opens tabs then locks the group with the entered password', async () => {
            const groupStore = useGroupStore()
            const tabsStore = useTabsStore()
            const modalStore = useModalStore()
            const group = fakeGroup({ isPrivate: true, links: fakeLinks(2) })

            expect(group.isEncrypted).toBeFalsy()

            useSettingsStore().settings.rememberPasswordAfterUnlock = false

            await groupStore.create(group)

            const opening = tabsStore.openTabs(group)

            await waitUntil(() => {
                expect(modalStore.isModalVisible('newPassword')).toBeTruthy()
            })

            modalStore.hide('newPassword', { newPass: 'amy-pass' })

            expect(await opening).toBeTruthy()

            const locked = groupStore.get(group.id)
            expect(locked?.isEncrypted).toBeTruthy()
            expect(await passwordStorage.get(group.id)).toBeNull()
        })

        it('fails before opening any tab when the password is invalid', async () => {
            const groupStore = useGroupStore()
            const tabsStore = useTabsStore()
            const group = fakeGroup({ isPrivate: true, links: fakeLinks(2) })

            useSettingsStore().settings.rememberPasswordAfterUnlock = false

            await groupStore.create(group)

            const opened = await tabsStore.openTabs(group, 'amy')

            expect(opened).toBeFalsy()
            expect(restoreTabs).not.toHaveBeenCalled()
            expect(showToast).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'error' }),
            )
        })

        it('uses the cached password without prompting', async () => {
            const groupStore = useGroupStore()
            const tabsStore = useTabsStore()
            const modalStore = useModalStore()
            const group = fakeGroup({ isPrivate: true, links: fakeLinks(2) })

            expect(group.isEncrypted).toBeFalsy()

            await groupStore.create(group)
            await passwordStorage.save(group.id, 'genshin-skirk')

            const opened = await tabsStore.openTabs(group)

            expect(opened).toBeTruthy()
            expect(modalStore.isModalVisible('newPassword')).toBeFalsy()
            expect(restoreTabs).toHaveBeenCalledWith(group.links)

            const locked = groupStore.get(group.id)
            expect(locked?.isEncrypted).toBeTruthy()
        })
    })
})
