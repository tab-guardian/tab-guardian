<script setup lang="ts">
import { useSidebarStore } from '@/stores/useSidebarStore'
import MenuIcon from '@/components/Icons/MenuIcon.vue'

const sidebarStore = useSidebarStore()
</script>

<template>
    <div
        @click="sidebarStore.toggle()"
        type="button"
        class="hamburger"
    >
        <MenuIcon />
    </div>
</template>

<style scoped lang="sass">
.hamburger
    width: 24px
    height: 24px
    cursor: pointer
    transition: transform .2s

    &:hover
        transform: scale(1.1)

    svg
        stroke: var(--tg-color-font)
        width: 100%
</style>

