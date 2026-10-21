// @vitest-environment happy-dom

import type { Pinia } from 'pinia'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { fakeGroup } from '@common/modules/fake'
import { useFolderStore } from '@/stores/folder'
import { useGroupStore } from '@/stores/group'
import { useModalStore } from '@/stores/modal'
import { useSettingsStore } from '@/stores/settings'
import { useFreshPinia, waitUntil } from '@common/modules/testUtils'
import EraseSection from '@settings/components/Views/DataControlView/EraseSection.vue'
import Button from '@common/components/Form/Button.vue'

function mountEraseSection(pinia: Pinia): ReturnType<typeof mount> {
    return mount(EraseSection, {
        global: {
            plugins: [pinia],
            stubs: {
                Section: { template: '<section><slot /></section>' },
            },
        },
    })
}

describe('EraseSection', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('erases groups but keeps folders and settings', async () => {
        const pinia = useFreshPinia()
        const modalStore = useModalStore()
        const folderStore = useFolderStore()
        const settingsStore = useSettingsStore()

        await folderStore.create('keep-me')
        await useGroupStore().create(fakeGroup())

        settingsStore.settings.rememberPasswordAfterUnlock = false
        await settingsStore.save()

        vi.spyOn(modalStore, 'show').mockImplementation((async () => ({
            isConfirmed: true,
        })) as typeof modalStore.show)

        const wrapper = mountEraseSection(pinia)
        wrapper.findComponent(Button).vm.$emit('clicked')

        await waitUntil(() => {
            expect(useGroupStore().rootGroups).toHaveLength(0)
        })

        await folderStore.load()
        expect(folderStore.folders.map(f => f.name)).toContain('keep-me')

        await settingsStore.load()
        expect(settingsStore.settings.rememberPasswordAfterUnlock).toBeFalsy()

        wrapper.unmount()
    })

    it('does nothing when confirm is declined', async () => {
        const pinia = useFreshPinia()
        const modalStore = useModalStore()

        await useGroupStore().create(fakeGroup())

        vi.spyOn(modalStore, 'show').mockImplementation((async () => ({
            isConfirmed: false,
        })) as typeof modalStore.show)

        const wrapper = mountEraseSection(pinia)
        wrapper.findComponent(Button).vm.$emit('clicked')

        await new Promise(resolve => setTimeout(resolve, 300))

        expect(useGroupStore().rootGroups).toHaveLength(1)

        wrapper.unmount()
    })
})
