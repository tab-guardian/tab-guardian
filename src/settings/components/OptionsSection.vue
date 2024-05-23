<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTransStore } from '@/stores/trans'
import { useSettingsStore } from '@/stores/settings'
import showToast from '@common/modules/showToast'
import Section from '@settings/components/Section.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'
import isDevelopment from '@common/modules/isDevelopment'

const { trans } = useTransStore()
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
        <Section :title="trans('Additional Options')">
            <div class="flex flex-col gap-2">
                <SlideSwitch
                    @changed="updateSettings"
                    v-model="store.settings.encryptAfterRestore"
                >
                    {{ trans('Lock the group back after restoring the links') }}
                </SlideSwitch>

                <SlideSwitch
                    @changed="updateSettings"
                    v-model="store.settings.showPrivateGroupsOnlyInIncognito"
                    :disabled="!incognitoModeAllowed"
                    :warning="incognitoWarningMessage"
                >
                    <!-- prettier-ignore -->
                    {{ trans('Show private groups only in browser incognito mode') }}
                </SlideSwitch>

                <SlideSwitch
                    @changed="updateSettings"
                    v-model="store.settings.overrideWithSameName"
                >
                    <!-- prettier-ignore -->
                    {{ trans( 'If the new group name matches an existing one, override it') }}
                </SlideSwitch>
            </div>
        </Section>
    </div>
</template>
