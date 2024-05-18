<script setup lang="ts">
import Hamburger from '@/components/Navbar/Sidebar/Hamburger.vue'
import RightSlideTransition from '@common/components/Transitions/RightSlideTransition.vue'
import Overlay from '@/components/Navbar/Sidebar/Overlay.vue'
import { useSidebarStore } from '@/stores/sidebar'

const sidebarStore = useSidebarStore()
</script>

<template>
    <Hamburger />

    <Teleport to="body">
        <Overlay v-if="sidebarStore.isOpen" @click="sidebarStore.toggle()" />

        <RightSlideTransition>
            <aside v-if="sidebarStore.isOpen" class="sidebar">Sidebar</aside>
        </RightSlideTransition>
    </Teleport>
</template>

<style scoped lang="sass">
.sidebar
    position: absolute
    width: 250px
    background: var(--tg-color-secondary)
    top: 0
    bottom: 0
    left: 0
    padding: 20px
    box-shadow: 0 0 10px 3px rgb(0 0 0 / 30%)
    z-index: 2
</style>
