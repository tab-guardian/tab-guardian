<script setup lang="ts">
import { useTransStore } from '@/stores/trans'
import { useSettingsStore } from '@/stores/settings'
import showToast from '@common/modules/showToast'
import Section from '@settings/components/Section.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'

const { trans } = useTransStore()
const store = useSettingsStore()

function save(): void {
    store.updateSettings()
    showToast(trans('Settings have been saved'))
}
</script>

<template>
    <div>
        <Section :title="trans('Additional Options')">
            <div class="flex flex-col gap-2">
                <SlideSwitch
                    @changed="save"
                    v-model="store.settings.encryptAfterRestore"
                >
                    {{ trans('Lock the group back after restoring the links') }}
                </SlideSwitch>

                <SlideSwitch
                    @changed="save"
                    v-model="store.settings.showPrivateGroupsOnlyInIncognito"
                >
                    <!-- prettier-ignore -->
                    {{ trans('Show private groups only in browser incognito mode') }}
                </SlideSwitch>
            </div>
        </Section>
    </div>
</template>
