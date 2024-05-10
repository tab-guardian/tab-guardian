<script setup lang="ts">
import { useGroupModalStore } from '@/stores/modals/useGroupModalStore'
import { useGroupStore } from '@/stores/useGroupStore'
import MainScreen from '@/components/MainScreen/MainScreen.vue'
import Navbar from '@/components/Navbar/Navbar.vue'
import GroupModal from '@/components/Modals/GroupModal/GroupModal.vue'
import DeleteGroupPopup from '@/components/Modals/GroupModal/DeleteGroupPopup.vue'
import SelectTabsModal from '@/components/Modals/SelectTabsModal/SelectTabsModal.vue'
import SettingsModal from '@/components/Modals/SettingsModal/SettingsModal.vue'

const groupModalStore = useGroupModalStore()
const groupStore = useGroupStore()

function deleteGroup() {
    if (!groupModalStore.selectedGroup) {
        console.warn('[Tab Guardian]: No group selected for deletion')
        return
    }

    groupStore.deleteGroup(groupModalStore.selectedGroup.id)
    groupModalStore.askToDelete = false
    groupModalStore.selectedGroup = null
}
</script>

<template>
    <Navbar />

    <main class="screen">
        <MainScreen />
        <GroupModal />
        <SelectTabsModal />
        <SettingsModal />
    </main>

    <DeleteGroupPopup
        v-if="groupModalStore.selectedGroup && groupModalStore.askToDelete"
        @confirm="deleteGroup"
        @cancel="groupModalStore.askToDelete = false"
    />
</template>

<style lang="sass">
@import '@/assets/sass/main'

.screen
    height: 495px
    overflow-y: auto
    overflow-x: hidden
    position: relative

    &::-webkit-scrollbar
        width: 7px

    &::-webkit-scrollbar-track
        background-color: var(--tg-color-bg-scrollbar)
        border-radius: 50px
        margin-top: 2px

    &::-webkit-scrollbar-thumb
        background-color: var(--tg-color-bg-scrollbar-thumb)
        border-radius: 10px
        border-radius: 50px
</style>
