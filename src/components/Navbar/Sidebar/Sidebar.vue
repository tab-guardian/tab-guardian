<script setup lang="ts">
import Hamburger from '@/components/Navbar/Sidebar/Hamburger.vue'
import { useSidebarStore } from '@/stores/useSidebarStore'

const sidebarStore = useSidebarStore()
</script>

<template>
    <Hamburger />

    <teleport to="body">
        <div v-if="sidebarStore.isOpen" class="sidebar">
            Sidebar
        </div>
    </teleport>
</template>

<style scoped lang="sass">
.sidebar
    position: absolute
    width: 250px
    background: white
    top: 0
    bottom: 0
    left: 0
    padding: 20px
    box-shadow: 0 0 30px 100px rgba(0, 0, 0, .5)
</style>
