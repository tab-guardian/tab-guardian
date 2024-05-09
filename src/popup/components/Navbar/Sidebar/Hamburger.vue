<script setup lang="ts">
import { useSidebarStore } from '@/stores/useSidebarStore'

const sidebarStore = useSidebarStore()
</script>

<template>
    <button
        @click="sidebarStore.toggle()"
        type="button"
        class="hambuger"
    >
        <span></span>
        <span></span>
    </button>
</template>

<style scoped lang="sass">
.hambuger
    width: 23px
    height: 20px
    background-color: transparent
    border: none
    cursor: pointer
    position: relative

    span
        width: 100%
        height: 3px
        display: block
        position: absolute
        background-color: var(--tg-color-font)
        transition: all .3s
        border-radius: 50px
        opacity: .8

    span:nth-child(1)
        top: 4px
        left: 0

    span:nth-child(2)
        bottom: 4px
        left: 0
</style>

