<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar'
import Hamburger from '@/components/Navbar/Sidebar/Hamburger.vue'
import RightSlideTransition from '@common/components/Transitions/RightSlideTransition.vue'
import Overlay from '@/components/Navbar/Sidebar/Overlay.vue'

const sidebarStore = useSidebarStore()
</script>

<template>
    <Hamburger />

    <Teleport to="body">
        <Overlay v-if="sidebarStore.isOpen" @click="sidebarStore.toggle()" />

        <RightSlideTransition>
            <aside
                v-if="sidebarStore.isOpen"
                class="z-30 absolute w-64 bg-secondary inset-y-0 left-0 p-10 shadow-md"
            >
                Sidebar
            </aside>
        </RightSlideTransition>
    </Teleport>
</template>
