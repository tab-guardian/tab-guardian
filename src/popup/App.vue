<script setup lang="ts">
import { onMounted, onBeforeMount } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { usePopupStore } from '@/stores/popup'
import { useTransStore } from '@/stores/trans'
import en from '@/locales/en.json'
import ru from '@/locales/ru.json'
import Navbar from '@/components/Navbar/Navbar.vue'
import DeleteGroupPopup from '@/components/Popups/DeleteGroupPopup.vue'
import GroupMenuPopup from '@/components/Popups/GroupMenuPopup.vue'
import NewGroupNamePopup from '@/components/Popups/NewGroupNamePopup.vue'
import RebindGroupPopup from '@/components/Popups/RebindGroupPopup.vue'
import AppearTransition from '@common/components/Transitions/AppearTransition.vue'

const { loadSettingsFromStorage } = useSettingsStore()
const { isOpenPopup } = usePopupStore()
const { loadMessages } = useTransStore()

onBeforeMount(() => {
    loadMessages({ en, ru })
})

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

    <AppearTransition>
        <DeleteGroupPopup v-if="isOpenPopup('deleteGroup')" />
    </AppearTransition>

    <AppearTransition>
        <GroupMenuPopup v-if="isOpenPopup('groupView')" />
    </AppearTransition>

    <AppearTransition>
        <NewGroupNamePopup v-if="isOpenPopup('groupName')" />
    </AppearTransition>

    <AppearTransition>
        <RebindGroupPopup v-if="isOpenPopup('rebindGroup')" />
    </AppearTransition>
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
