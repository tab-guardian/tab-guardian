// @vitest-environment happy-dom

import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { fakeGroup } from '@common/modules/fake'
import ListItems from '@/components/Views/MainView/ListItems/ListItems.vue'

describe('ListItems', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    it('does not show hidden groups on the main screen', () => {
        const visibleGroup = fakeGroup({ id: 1, name: 'Work' })
        const hiddenGroup = fakeGroup({ id: 2, name: 'Secret', hide: true })

        const wrapper = mount(ListItems, {
            props: {
                groups: [visibleGroup, hiddenGroup],
            },
            global: {
                stubs: {
                    GroupItem: true,
                    FolderItem: true,
                },
            },
        })

        const renderedIds = wrapper
            .findAll('[data-group-id]')
            .map(el => el.attributes('data-group-id'))

        expect(renderedIds).toEqual(['1'])

        wrapper.unmount()
    })
})
