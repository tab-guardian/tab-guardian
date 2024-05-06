<script setup lang="ts">
import Hamburger from '@/components/Navbar/Sidebar/Hamburger.vue'
import RightSlideTransition from '@/components/Transitions/RightSlideTransition.vue'
import Overlay from '@/components/Navbar/Sidebar/Overlay.vue'
import { useSidebarStore } from '@/stores/useSidebarStore'

const sidebarStore = useSidebarStore()
</script>

<template>
    <Hamburger />

    <teleport to="body">
        <Overlay
            v-if="sidebarStore.isOpen"
            @click="sidebarStore.toggle()"
        />

        <RightSlideTransition>
            <div v-if="sidebarStore.isOpen" class="sidebar">
                Sidebar
            </div>
        </RightSlideTransition>
    </teleport>
</template>

<style scoped lang="sass">
.sidebar
    position: absolute
    width: 250px
    background: var(--tg-color-bg-light)
    top: 0
    bottom: 0
    left: 0
    padding: 20px
    box-shadow: 0 0 10px 3px rgb(0 0 0 / 30%)
</style>
