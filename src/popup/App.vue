<script setup lang="ts">
import Navbar from '@/components/Navbar/Navbar.vue'
import DeleteGroupPopup from '@/components/Popups/DeleteGroupPopup.vue'
import GroupMenuPopup from '@/components/Popups/GroupMenuPopup.vue'
import GroupNamePopup from '@/components/Popups/GroupNamePopup.vue'
</script>

<template>
    <Navbar />

    <main class="screen">
        <RouterView v-slot="{ Component, route }">
            <Transition name="screen">
                <component :is="Component" :key="route.path" />
            </Transition>
        </RouterView>
    </main>

    <DeleteGroupPopup />
    <GroupMenuPopup />
    <GroupNamePopup />
</template>

<style lang="sass">
@import '@/assets/sass/main'

.screen-enter-active,
.screen-leave-active
    transition: opacity .1s cubic-bezier(1, 0.5, 0.8, 1)

.screen-enter-to,
.screen-leave-from
    opacity: 1

.screen-enter-from,
.screen-leave-to
    opacity: 0

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
