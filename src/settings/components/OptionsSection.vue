<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import trans from '@common/modules/trans'
import { useSettingsStore } from '@/stores/settings'
import showToast from '@common/modules/showToast'
import Section from '@settings/components/Section.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'
import isDevelopment from '@common/modules/isDevelopment'

const store = useSettingsStore()
const incognitoModeAllowed = ref<boolean>(false)

const incognitoWarningMessage = computed<string | null>(() => {
    return incognitoModeAllowed.value
        ? null
        : trans(
              `Go to the extension settings and enable the option 'Allow in incognito' or 'Allow in Private'`,
          )
})

onMounted(async () => {
    if (!isDevelopment()) {
        incognitoModeAllowed.value =
            await chrome.extension.isAllowedIncognitoAccess()
    }
})

function updateSettings(): void {
    store.updateSettings()
    showToast(trans('Settings have been saved'))
}
</script>

<template>
    <div>
        <Section :title="trans('additional_options')">
            <div class="flex flex-col gap-3">
                <SlideSwitch
                    @changed="updateSettings"
                    v-model="store.settings.encryptAfterRestore"
                >
                    {{ trans('Lock the group back after restoring the tabs') }}
                </SlideSwitch>

                <SlideSwitch
                    @changed="updateSettings"
                    v-model="store.settings.overrideWithSameName"
                >
                    <!-- prettier-ignore -->
                    {{ trans( 'If the new group name matches an existing one, override it') }}
                </SlideSwitch>

                <SlideSwitch
                    @changed="updateSettings"
                    v-model="store.settings.showPrivateGroupsOnlyInIncognito"
                    :disabled="!incognitoModeAllowed"
                    :warning="incognitoWarningMessage"
                >
                    <!-- prettier-ignore -->
                    {{ trans('Show private groups only in browser incognito mode. In regular browser mode, they will be hidden') }}
                </SlideSwitch>

                <SlideSwitch
                    @changed="updateSettings"
                    v-model="store.settings.showOnlyPrivateGroupsInIncognito"
                    :disabled="!incognitoModeAllowed"
                    :warning="incognitoWarningMessage"
                >
                    <!-- prettier-ignore -->
                    {{ trans('Show only private groups in browser incognito mode. It means that public groups will be hidden in incognito mode') }}
                </SlideSwitch>
            </div>
        </Section>
    </div>
</template>
