<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useNotificationStore } from '@/stores/notification'
import { useAttemptsStore } from '@/stores/attempts'
import Navbar from '@/components/Navbar/Navbar.vue'
import AppearTransition from '@common/components/Transitions/AppearTransition.vue'
import Popups from '@/components/Popups/Popups.vue'
import NewGroupNamePopup from '@/components/Popups/NewGroupNamePopup.vue'
import DeleteGroupPopup from '@/components/Popups/DeleteGroupPopup.vue'
import NewPasswordPopup from '@/components/Popups/NewPasswordPopup.vue'
import EnterPasswordPopup from '@/components/Popups/EnterPasswordPopup.vue'
import RebindGroupPopup from '@/components/Popups/RebindGroupPopup.vue'
import ChooseEmojiPopup from '@/components/Popups/ChooseEmojiPopup.vue'
import ChooseImageIconPopup from '@/components/Popups/ChooseImageIconPopup.vue'
import LinkMenuPopup from '@/components/Popups/LinkMenuPopup.vue'
import GroupMenuPopup from '@/components/Popups/GroupMenuPopup.vue'
import EditGroupNamePopup from '@/components/Popups/EditGroupNamePopup.vue'

onMounted(async () => {
    handleDarkThem()
    await useSettingsStore().loadSettingsFromStorage()
    await useNotificationStore().recalculateNotification()
    await useAttemptsStore().loadAttemptsFromStorage()
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

    <Popups
        :popups="[
            { comp: DeleteGroupPopup, name: 'deleteGroup' },
            { comp: NewGroupNamePopup, name: 'newGroupName' },
            { comp: NewPasswordPopup, name: 'newPassword' },
            { comp: EnterPasswordPopup, name: 'enterPassword' },
            { comp: RebindGroupPopup, name: 'rebindGroup' },
            { comp: ChooseEmojiPopup, name: 'chooseEmoji' },
            { comp: ChooseImageIconPopup, name: 'chooseImageIcon' },
            { comp: LinkMenuPopup, name: 'linkMenuView' },
            { comp: GroupMenuPopup, name: 'groupMenuView' },
            { comp: EditGroupNamePopup, name: 'editGroupName' },
        ]"
    />
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
