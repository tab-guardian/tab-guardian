// @vitest-environment happy-dom

import type { VueWrapper } from '@vue/test-utils'
import type { Group, Folder } from '@common/types'
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { fakeGroup, fakeFolder } from '@common/modules/fake'
import { useGroupStore } from '@/stores/group'
import Message from '@common/components/Message.vue'
import Spinner from '@common/components/Spinner.vue'
import ListItems from '@/components/Views/MainView/ListItems/ListItems.vue'

function mountList(props: { groups: Group[]; folders?: Folder[] }): VueWrapper {
    return mount(ListItems, {
        props,
        global: {
            stubs: {
                GroupItem: true,
                FolderItem: true,
            },
        },
    })
}

function renderedGroupIds(wrapper: VueWrapper): (string | undefined)[] {
    return wrapper
        .findAll('[data-group-id]')
        .map(el => el.attributes('data-group-id'))
}

describe('ListItems', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    it('does not show hidden groups on the main screen', () => {
        const visibleGroup = fakeGroup({ id: 1, name: 'Work' })
        const hiddenGroup = fakeGroup({ id: 2, name: 'Secret', hide: true })

        const wrapper = mountList({
            groups: [visibleGroup, hiddenGroup],
        })

        expect(renderedGroupIds(wrapper)).toEqual(['1'])

        wrapper.unmount()
    })

    it('shows all visible groups in the given order', () => {
        const wrapper = mountList({
            groups: [
                fakeGroup({ id: 3 }),
                fakeGroup({ id: 1 }),
                fakeGroup({ id: 2 }),
            ],
        })

        expect(renderedGroupIds(wrapper)).toEqual(['3', '1', '2'])

        wrapper.unmount()
    })

    it('shows the spinner instead of groups while loading', () => {
        const groupStore = useGroupStore()
        groupStore.loading = true

        const wrapper = mountList({ groups: [fakeGroup({ id: 1 })] })

        expect(wrapper.findComponent(Spinner).exists()).toBeTruthy()
        expect(renderedGroupIds(wrapper)).toHaveLength(0)

        wrapper.unmount()
    })

    it('shows the empty message when there are no groups and no folders', () => {
        const wrapper = mountList({ groups: [] })

        expect(wrapper.findComponent(Message).exists()).toBeTruthy()
        expect(renderedGroupIds(wrapper)).toHaveLength(0)

        wrapper.unmount()
    })

    it('does not show the empty message when a group is visible', () => {
        const wrapper = mountList({ groups: [fakeGroup({ id: 1 })] })

        expect(wrapper.findComponent(Message).exists()).toBeFalsy()

        wrapper.unmount()
    })

    it('still shows folders when every group is hidden', () => {
        const wrapper = mountList({
            groups: [fakeGroup({ id: 1, hide: true })],
            folders: [fakeFolder({ id: 9 })],
        })

        expect(wrapper.findComponent(Message).exists()).toBeFalsy()
        expect(renderedGroupIds(wrapper)).toHaveLength(0)
        expect(wrapper.find('[data-folder-id="9"]').exists()).toBeTruthy()

        wrapper.unmount()
    })
})
