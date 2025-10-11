// @vitest-environment happy-dom

import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { trans } from '@common/modules/utils'
import { useSettingsStore } from '@/stores/settings'
import { getFakeGroup } from '@common/modules/fake'
import IsUnlockedBox from '@/components/Views/GroupView/IsUnlockedBox.vue'

describe('IsUnlockedBox', () => {
    beforeEach(() => setActivePinia(createPinia()))

    it('"New password" checkbox is visible when password is set to cached', () => {
        const settingsStore = useSettingsStore()
        settingsStore.settings.rememberPasswordAfterUnlock = true

        const wrapper = mount(IsUnlockedBox, {
            props: {
                group: getFakeGroup(),
            }
        })

        expect(wrapper.html()).toContain(trans('new_password'))
    })

    it('"New password" checkbox should not be visible when password is not set to cached', () => {
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
