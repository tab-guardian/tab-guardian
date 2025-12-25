<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useNotificationStore } from '@/stores/notification'
import { useAttemptsStore } from '@/stores/attempts'
import Navbar from '@/components/Navbar/Navbar.vue'
import AppearTransition from '@common/components/Transitions/AppearTransition.vue'
import Modals from '@/components/Modals/Modals.vue'
import ConfirmModal from '@/components/Modals/ConfirmModal.vue'
import NewPasswordModal from '@/components/Modals/NewPasswordModal.vue'
import PasswordModal from '@/components/Modals/PasswordModal.vue'
import BindGroupModal from '@/components/Modals/Group/BindGroupModal.vue'
import ChooseEmojiModal from '@/components/Modals/Group/ChooseEmojiModal.vue'
import ChooseImageIconModal from '@/components/Modals/Group/ChooseImageIconModal.vue'
import LinkMenuModal from '@/components/Modals/Link/LinkMenuModal.vue'
import GroupMenuModal from '@/components/Modals/Group/GroupMenuModal.vue'
import FolderMenuModal from '@/components/Modals/Folder/FolderMenuModal.vue'
import TextInputModal from '@/components/Modals/TextInputModal.vue'

onMounted(async () => {
    handleDarkTheme()
    await useSettingsStore().load()
    await useAttemptsStore().load()
    await useNotificationStore().recalculateNotification()
})

function handleDarkTheme(): void {
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

    <Modals
        :modals="[
            { comp: GroupMenuModal, name: 'groupMenu' },
            { comp: FolderMenuModal, name: 'folderMenu' },
            { comp: NewPasswordModal, name: 'newPassword' },
            { comp: PasswordModal, name: 'password' },
            { comp: BindGroupModal, name: 'bindGroup' },
            { comp: ChooseEmojiModal, name: 'chooseEmoji' },
            { comp: ChooseImageIconModal, name: 'chooseImageIcon' },
            { comp: LinkMenuModal, name: 'linkMenu' },
            { comp: ConfirmModal, name: 'confirm' },
            { comp: TextInputModal, name: 'textInput' },
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
