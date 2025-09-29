<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { trans } from '@common/modules/trans'
import Spinner from '@common/components/Spinner.vue'
import SettingsSidebar from '@settings/components/SettingsSidebar.vue'

const settingsStore = useSettingsStore()

onMounted(() => {
    settingsStore.loadSettingsFromStorage()
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
</template>
