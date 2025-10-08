// @vitest-environment happy-dom

import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { trans } from '@common/modules/trans'
import { useSettingsStore } from '@/stores/settings'
import { getFakeGroup } from '@common/modules/testUtils'
import IsUnlockedBox from '@/components/Views/GroupView/IsUnlockedBox.vue'

describe('IsUnlockedBox', () => {
    beforeEach(() => setActivePinia(createPinia()))

    it('We can see "New password" checkbox if password is set to remembered in settings', () => {
        const settingsStore = useSettingsStore()
        settingsStore.settings.rememberPasswordAfterUnlock = true

        const wrapper = mount(IsUnlockedBox, {
            props: {
                group: getFakeGroup(),
            }
        })

        expect(wrapper.html()).toContain(trans('new_password'))
    })

    it('We cannot see "New password" checkbox if password is set to not remembered in settings', () => {
        const settingsStore = useSettingsStore()
        settingsStore.settings.rememberPasswordAfterUnlock = false

        const wrapper = mount(IsUnlockedBox, {
            props: {
                group: getFakeGroup(),
            }
        })

        expect(wrapper.html()).not.toContain(trans('new_password'))
    })
})
