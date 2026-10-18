// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { fakeGroup } from '@common/modules/fake'
import { restoreTabs } from '@common/modules/tabs/restoreTabs'
import { waitUntil } from '@common/modules/testUtils'
import { useFolderStore } from '@/stores/folder'
import { useGroupStore } from '@/stores/group'
import { useSettingsStore } from '@/stores/settings'
import { runtime } from '@common/modules/runtime'
import GroupSearch from '@/components/Views/MainView/NewGroup/GroupSearch.vue'

vi.mock('vue-router', () => ({
    useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@common/modules/tabs/restoreTabs', () => ({
    restoreTabs: vi.fn(),
}))

vi.mock('@common/modules/toast', () => ({
    showToast: vi.fn(),
}))

describe('GroupSearch', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
        vi.mocked(restoreTabs).mockResolvedValue([])
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('restores folders after opening a group with Enter', async () => {
        const folderStore = useFolderStore()
        const groupStore = useGroupStore()

        await folderStore.create('work')
        await groupStore.create(fakeGroup({ name: 'nice' }))

        expect(folderStore.folders).toHaveLength(1)

        const wrapper = mount(GroupSearch, { attachTo: document.body })
        const input = wrapper.find('input')

        await input.setValue('nice')

        await waitUntil(() => {
            expect(folderStore.folders).toHaveLength(0)
        })
        ;(input.element as HTMLInputElement).focus()

        expect(document.activeElement).toBe(input.element)

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))

        await waitUntil(() => {
            expect(folderStore.folders).toHaveLength(1)
        })

        wrapper.unmount()
    })

    it('restores full list of groups after opening a group with Enter', async () => {
        const groupStore = useGroupStore()

        await groupStore.createMany([
            fakeGroup({ name: 'nice' }),
            fakeGroup({ name: 'other' }),
        ])

        expect(groupStore.rootGroups).toHaveLength(2)

        const wrapper = mount(GroupSearch, { attachTo: document.body })
        const input = wrapper.find('input')

        await input.setValue('nice')

        await waitUntil(() => {
            expect(groupStore.rootGroups).toHaveLength(1)
        })
        ;(input.element as HTMLInputElement).focus()

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))

        await waitUntil(() => {
            expect(groupStore.rootGroups).toHaveLength(2)
        })

        wrapper.unmount()
    })

    it('hides private groups from search when private groups are incognito only', async () => {
        vi.spyOn(runtime.windows, 'getCurrent').mockResolvedValue(null)

        const groupStore = useGroupStore()
        const settingsStore = useSettingsStore()

        settingsStore.settings.showPrivateGroupsOnlyInIncognito = true

        await groupStore.create(fakeGroup({ name: 'secret', isPrivate: true }))

        expect(groupStore.rootGroups[0]?.hide).toBe(true)

        const wrapper = mount(GroupSearch, { attachTo: document.body })
        const input = wrapper.find('input')

        await input.setValue('secret')

        expect(groupStore.rootGroups).toHaveLength(0)

        wrapper.unmount()
    })

    it('shows private groups in search inside an incognito window', async () => {
        vi.spyOn(runtime.windows, 'getCurrent').mockResolvedValue({
            incognito: true,
        } as any)

        const groupStore = useGroupStore()
        const settingsStore = useSettingsStore()

        settingsStore.settings.showPrivateGroupsOnlyInIncognito = true

        await groupStore.create(fakeGroup({ name: 'secret', isPrivate: true }))

        expect(groupStore.rootGroups).toHaveLength(1)

        const wrapper = mount(GroupSearch, { attachTo: document.body })
        const input = wrapper.find('input')

        await input.setValue('secret')

        expect(groupStore.rootGroups).toHaveLength(1)
        expect(groupStore.rootGroups[0]?.name).equal('secret')

        wrapper.unmount()
    })
})
