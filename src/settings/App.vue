<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useAttemptsStore } from '@/stores/attempts'
import Spinner from '@common/components/Spinner.vue'
import SettingsSidebar from '@settings/components/SettingsSidebar.vue'
import ConfirmPopup from '@/components/Popups/ConfirmPopup.vue'
import Popups from '@/components/Popups/Popups.vue'
import NewPasswordPopup from '@/components/Popups/NewPasswordPopup.vue'
import PasswordPopup from '@/components/Popups/PasswordPopup.vue'
import RemoveURLLockPopup from '@/components/Popups/RemoveURLLockPopup.vue'

const settingsStore = useSettingsStore()

onMounted(async () => {
    await settingsStore.loadSettingsFromStorage()
    await useAttemptsStore().loadAttemptsFromStorage()
})
</script>

<template>
    <div class="max-w-[1000px] mx-3 md:mx-auto">
        <Spinner v-if="settingsStore.loading" />

        <div v-else class="grid grid-cols-1 md:grid-cols-[220px_3fr] mt-3">
            <SettingsSidebar />
            <div class="bg-page border border-border p-5 rounded-xl">
                <RouterView />
            </div>
        </div>
    </div>

    <Popups
        :popups="[
            { comp: RemoveURLLockPopup, name: 'removeURLLock' },
            { comp: NewPasswordPopup, name: 'newPassword' },
            { comp: PasswordPopup, name: 'password' },
            { comp: ConfirmPopup, name: 'confirm' },
        ]"
    />
</template>
