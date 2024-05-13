<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar'
import MenuIcon from '@/components/Icons/MenuIcon.vue'
import Control from '@/components/Control.vue'

const sidebarStore = useSidebarStore()
</script>

<template>
    <Control @click="sidebarStore.toggle()" type="button">
        <MenuIcon />
    </Control>
</template>
