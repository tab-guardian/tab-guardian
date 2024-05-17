<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import Navbar from '@/components/Navbar/Navbar.vue'
import DeleteGroupPopup from '@/components/Popups/DeleteGroupPopup.vue'
import GroupMenuPopup from '@/components/Popups/GroupMenuPopup.vue'
import GroupNamePopup from '@/components/Popups/GroupNamePopup.vue'

const { loadSettingsFromStorage } = useSettingsStore()

onMounted(() => loadSettingsFromStorage())
</script>

<template>
    <Navbar />

    <main class="h-[495px] overflow-y-auto overflow-x-hidden relative">
        <RouterView v-slot="{ Component, route }">
            <Transition
                enter-active-class="transition-opacity ease-in-out duration-300"
                enter-to-class="opacity-100"
                leave-from-class="opacity-100"
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
            >
                <component :is="Component" :key="route.path" />
            </Transition>
        </RouterView>
    </main>

    <DeleteGroupPopup />
    <GroupMenuPopup />
    <GroupNamePopup />
</template>

<style>
@import '@/assets/sass/main.sass';

main::-webkit-scrollbar {
    width: 7px;
}

main::-webkit-scrollbar-track {
    background-color: var(--tg-color-bg-scrollbar);
    border-radius: 50px;
    margin-top: 2px;
}

main::-webkit-scrollbar-thumb {
    background-color: var(--tg-color-bg-scrollbar-thumb);
    border-radius: 10px;
    border-radius: 50px;
}
</style>
