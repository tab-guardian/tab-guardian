<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { runtime } from '@common/modules/runtime'
import { useSettingsStore } from '@/stores/settings'
import { trans } from '@common/modules'
import { showToast } from '@common/modules/toast'
import Section from '@settings/components/Section.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'

const settingsStore = useSettingsStore()
const incognitoModeAllowed = ref<boolean>(false)

const incognitoWarningMessage = computed<string | null>(() => {
    return incognitoModeAllowed.value
        ? null
        : trans('go_to_settings_and_enable_allow_incognito')
})

onMounted(async () => {
    incognitoModeAllowed.value = await runtime.extension.isAllowedIncognitoAccess()
})

function save(): void {
    settingsStore.save()
    showToast({ text: trans('settings_saved') })
}
</script>

<template>
    <Section :title="trans('additional_options')">
        <div class="flex flex-col gap-3">
            <SlideSwitch
                @changed="save"
                v-model="settingsStore.settings.encryptAfterRestore"
            >
                {{ trans('lock_group_after_restore') }}
            </SlideSwitch>

            <SlideSwitch
                @changed="save"
                v-model="settingsStore.settings.overrideWithSameName"
            >
                {{ trans('override_existing_match') }}
            </SlideSwitch>

            <SlideSwitch
                @changed="save"
                v-model="settingsStore.settings.rememberPasswordAfterUnlock"
                :description="trans('remember_pass_after_unlock_desc')"
            >
                {{ trans('remember_pass_after_unlock') }}
            </SlideSwitch>

            <SlideSwitch
                @changed="save"
                v-model="settingsStore.settings.showPrivateGroupsOnlyInIncognito"
                :disabled="!incognitoModeAllowed"
                :warning="incognitoWarningMessage"
            >
                {{ trans('show_private_groups_incognito') }}
            </SlideSwitch>

            <SlideSwitch
                @changed="save"
                v-model="settingsStore.settings.showOnlyPrivateGroupsInIncognito"
                :disabled="!incognitoModeAllowed"
                :warning="incognitoWarningMessage"
            >
                {{ trans('only_private_groups_incognito') }}
            </SlideSwitch>
        </div>
    </Section>
</template>
