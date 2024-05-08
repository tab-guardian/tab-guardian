<script setup lang="ts">
import EllipsisIcon from '@/components/Icons/EllipsisIcon.vue'

function openContextMenu() {
    console.log('openContextMenu')
}
</script>

<template>
    <div
        @click.prevent="openContextMenu"
        class="more-button"
    >
        <EllipsisIcon width="22" height="22" />
    </div>
</template>

<style lang="sass" scoped>
.more-button
    display: flex
    align-items: center
    color: var(--tg-color-text-default)
    padding: 3px 0
    border-radius: 4px
    transition: background-color .2s, border-color .2s
    border: 1px solid transparent

    &:hover
        background-color: var(--tg-color-bg-light)
        border-color: var(--tg-color-border-default)
</style>