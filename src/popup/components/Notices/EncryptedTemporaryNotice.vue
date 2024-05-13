<script setup lang="ts">
import { useTransStore } from '@/stores/trans'
import { useSettingsStore } from '@/stores/settings'
import Notice from '@/components/Notices/Notice.vue'
import AppearTransition from '@/components/Transitions/AppearTransition.vue'

const { trans } = useTransStore()
const settingsStore = useSettingsStore()

const message = trans(
    'This group is only temporary decrypted. It will be encrypted again after you close the popup window',
)

function close(): void {
    settingsStore.settings.showNotices.temporaryEncrypted = false
    settingsStore.updateSettings()
}
</script>

<template>
    <AppearTransition>
        <Notice
            v-if="settingsStore.settings.showNotices.temporaryEncrypted"
            @confirm="close"
            :message
        />
    </AppearTransition>
</template>
