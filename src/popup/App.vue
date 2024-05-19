<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import Navbar from '@/components/Navbar/Navbar.vue'
import DeleteGroupPopup from '@/components/Popups/DeleteGroupPopup.vue'
import GroupMenuPopup from '@/components/Popups/GroupMenuPopup.vue'
import GroupNamePopup from '@/components/Popups/GroupNamePopup.vue'
import AppearTransition from '@common/components/Transitions/AppearTransition.vue'

const { loadSettingsFromStorage } = useSettingsStore()

onMounted(() => {
    loadSettingsFromStorage()

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark')
    }
})
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

    <DeleteGroupPopup />
    <GroupMenuPopup />
    <GroupNamePopup />
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
