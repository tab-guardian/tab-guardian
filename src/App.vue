<script setup lang="ts">
import MainScreen from '@/components/MainScreen/MainScreen.vue'
import Navbar from '@/components/Navbar/Navbar.vue'
import GroupModal from '@/components/Modals/GroupModal/GroupModal.vue'
</script>

<template>
    <Navbar />

    <main class="screen">
        <MainScreen />
        <GroupModal />
    </main>
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
        background-color: var(--tg-scrollbar-bg)
        border-radius: 50px
        margin-top: 2px

    &::-webkit-scrollbar-thumb
        background-color: var(--tg-scrollbar-bg-thumb)
        border-radius: 10px
        border-radius: 50px
</style>
