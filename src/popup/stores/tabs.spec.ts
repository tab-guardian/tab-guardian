// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, afterEach, suite, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { trans } from '@common/modules'
import { fakeGroup, fakeLink, fakeLinks } from '@common/modules/fake'
import { restoreTabs } from '@common/modules/tabs/restoreTabs'
import { showToast } from '@common/modules/toast'
import { passwordStorage } from '@common/modules/storage/password'
import { useGroupStore } from '@/stores/group'
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
            await tabsStore.openAndDeleteTabs(group)

            expect(groupStore.get(group.id)).toBeNull()
            expect(showToast).not.toHaveBeenCalled()
        })

        it('keeps group with only the failed links when some tabs fail', async () => {
            const groupStore = useGroupStore()
            const tabsStore = useTabsStore()
            const failedLink = fakeLink()
            const group = fakeGroup({ links: [fakeLink(), failedLink] })

            await groupStore.create(group)
            vi.mocked(restoreTabs).mockResolvedValue([failedLink])

            await tabsStore.openAndDeleteTabs(group)

            const kept = groupStore.get(group.id)

            expect(kept).not.toBeNull()
            expect(kept?.links).toEqual([failedLink])
            expect(showToast).toHaveBeenCalledWith({
                text: trans('only_some_tabs_restored', '1', '2'),
            })
        })

        it('keeps the whole group when every tab fails', async () => {
            const groupStore = useGroupStore()
            const tabsStore = useTabsStore()
            const group = fakeGroup({ links: fakeLinks(2) })

            await groupStore.create(group)
            vi.mocked(restoreTabs).mockResolvedValue(group.links)

            await tabsStore.openAndDeleteTabs(group)

            const kept = groupStore.get(group.id)

            expect(kept?.links).toHaveLength(2)
            expect(showToast).toHaveBeenCalledWith({
                text: trans('only_some_tabs_restored', '0', '2'),
            })
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
})
