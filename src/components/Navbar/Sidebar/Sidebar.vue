<script setup lang="ts">
import Hamburger from '@/components/Navbar/Sidebar/Hamburger.vue'
import RightSlideTransition from '@/components/Transitions/RightSlideTransition.vue'
import CloseIcon from '@/components/Icons/CloseIcon.vue'
import { useSidebarStore } from '@/stores/useSidebarStore'

const sidebarStore = useSidebarStore()
</script>

<template>
    <Hamburger />

    <teleport to="body">
        <div
            v-if="sidebarStore.isOpen"
            @click="sidebarStore.toggle"
            class="overlay"
        >
            <CloseIcon />
        </div>

        <RightSlideTransition>
            <div v-if="sidebarStore.isOpen" class="sidebar">
                Sidebar
            </div>
        </RightSlideTransition>
    </teleport>
</template>

<style scoped lang="sass">
.overlay
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: rgba(0, 0, 0, .5)
    cursor: pointer

    &:hover svg
        background-color: #f42323

    svg
        width: 32px
        height: 32px
        position: absolute
        right: 25px
        top: 10px
        color: white
        background-color: rgba(0, 0, 0, .7)
        border-radius: 50%
        padding: 5px
        transition: background-color .2s

.sidebar
    position: absolute
    width: 250px
    background: white
    top: 0
    bottom: 0
    left: 0
    padding: 20px
    box-shadow: 0 0 10px 3px rgba(0, 0, 0, .3)
</style>
