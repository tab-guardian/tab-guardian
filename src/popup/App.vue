<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useNotificationStore } from '@/stores/notification'
import Navbar from '@/components/Navbar/Navbar.vue'
import AppearTransition from '@common/components/Transitions/AppearTransition.vue'
import Popups from '@/components/Popups/Popups.vue'

const { loadSettingsFromStorage } = useSettingsStore()
const { recalculateNotification } = useNotificationStore()

onMounted(async () => {
    handleDarkThem()
    await loadSettingsFromStorage()
    await recalculateNotification()
})

function handleDarkThem(): void {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark')
    }
}
</script>

<template>
    <Navbar />

    <main class="h-[495px] overflow-y-auto overflow-x-hidden relative">
        <RouterView v-slot="{ Component, route }">
            <AppearTransition>
                <component :is="Component" :key="route.path" />
            </AppearTransition>
        </RouterView>
    </main>

    <Popups />
</template>

<style>
main::-webkit-scrollbar {
    width: 7px;
}

main::-webkit-scrollbar-track {
    background-color: var(--tg-color-secondary-scrollbar);
    border-radius: 50px;
    margin-top: 2px;
}

main::-webkit-scrollbar-thumb {
    background-color: var(--tg-color-secondary-scrollbar-thumb);
    border-radius: 10px;
    border-radius: 50px;
}
</style>
