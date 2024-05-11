<script setup lang="ts">
import MainScreen from '@/components/MainScreen/MainScreen.vue'
import Navbar from '@/components/Navbar/Navbar.vue'
import GroupModal from '@/components/Modals/GroupModal/GroupModal.vue'
import DeleteGroupPopup from '@/components/Popups/DeleteGroupPopup.vue'
import GroupMenuPopup from '@/components/Popups/GroupMenuPopup.vue'
import GroupTitlePopup from '@/components/Popups/GroupTitlePopup.vue'
import SelectTabsModal from '@/components/Modals/SelectTabsModal/SelectTabsModal.vue'
import SettingsModal from '@/components/Modals/SettingsModal/SettingsModal.vue'
</script>

<template>
    <Navbar />

    <main class="screen">
        <MainScreen />
        <GroupModal />
        <SelectTabsModal />
        <SettingsModal />
    </main>

    <DeleteGroupPopup />
    <GroupMenuPopup />
    <GroupTitlePopup />
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
