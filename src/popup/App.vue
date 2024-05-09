<script setup lang="ts">
import MainScreen from '@/components/MainScreen/MainScreen.vue'
import Navbar from '@/components/Navbar/Navbar.vue'
import GroupModal from '@/components/Modals/GroupModal/GroupModal.vue'
import { useGroupModal } from '@/stores/modals/useGroupModal'
import DeleteGroupPopup from '@/components/Modals/GroupModal/DeleteGroupPopup.vue'

const groupModal = useGroupModal()
</script>

<template>
    <Navbar />

    <main class="screen">
        <MainScreen />
        <GroupModal />
    </main>

    <DeleteGroupPopup
        v-if="groupModal.selectedGroup && groupModal.askToDelete"
        @confirm="groupModal.deleteGroup"
        @cancel="groupModal.askToDelete = false"
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
