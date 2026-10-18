// @vitest-environment happy-dom

import type { VueWrapper } from '@vue/test-utils'
import type { SelectTabsOperation } from '@common/types'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { fakeGroup } from '@common/modules/fake'
import { waitUntil } from '@common/modules/testUtils'
import { showToast } from '@common/modules/toast'
import { useGroupStore } from '@/stores/group'
import { config } from '@common/config'
import router from '@/router'
import ControlButton from '@/components/Views/SelectTabsView/ControlButton.vue'
import TabItem from '@/components/Views/SelectTabsView/TabItem.vue'
import SelectTabsView from '@/components/Views/SelectTabsView/SelectTabsView.vue'

vi.mock('@common/modules/toast', () => ({
    showToast: vi.fn(),
}))

async function mountView(operation: SelectTabsOperation): Promise<VueWrapper> {
    await router.push({ name: 'select-tabs', params: { operation } })

    const wrapper = mount(SelectTabsView, {
        global: { plugins: [router] },
        attachTo: document.body,
    })

    // Links provided by the web runtime adapter
    await waitUntil(() => {
        expect(wrapper.findAllComponents(TabItem)).toHaveLength(
            config.WEB_LINKS_AMOUNT,
        )
    })

    return wrapper
}

function selectAllTabs(wrapper: VueWrapper): void {
    wrapper.findAllComponents(ControlButton)[0]!.trigger('click')
}

function pressEnter(): void {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
}

describe('SelectTabsView', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('adds selected tabs to the selected group when Enter is pressed in adding mode', async () => {
        const groupStore = useGroupStore()
        const group = fakeGroup({ name: 'work', links: [] })

        await groupStore.create(group)
        groupStore.selectedGroup = group

        expect(groupStore.rootGroups).toHaveLength(1)

        const wrapper = await mountView('adding')

        selectAllTabs(wrapper)
        pressEnter()

        await waitUntil(() => {
            expect(groupStore.rootGroups).toHaveLength(1)
            expect(groupStore.rootGroups[0]!.links).toHaveLength(
                config.WEB_LINKS_AMOUNT,
            )
        })

        expect(showToast).toHaveBeenCalled()

        wrapper.unmount()
    })

    it('creates a group with selected tabs when Enter is pressed in creating mode', async () => {
        const groupStore = useGroupStore()

        const wrapper = await mountView('creating')

        selectAllTabs(wrapper)
        pressEnter()

        await waitUntil(() => {
            expect(groupStore.rootGroups).toHaveLength(1)
            expect(groupStore.rootGroups[0]!.links).toHaveLength(
                config.WEB_LINKS_AMOUNT,
            )
        })

        wrapper.unmount()
    })
})
