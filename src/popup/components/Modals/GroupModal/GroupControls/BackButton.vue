<script setup lang="ts">
import ChevronRightIcon from '@/components/Icons/ChevronRightIcon.vue'
</script>

<template>
    <button
        class="back-button"
        type="button"
    >
        <ChevronRightIcon />
    </button>
</template>

<style lang="sass" scoped>
.back-button
    display: flex
    align-items: center
    justify-content: center
    gap: 5px
    background-color: var(--tg-color-bg-gray)
    transition: background-color .2s
    color: #fff
    padding: 9px 13px
    border: none
    border-radius: 8px
    cursor: pointer

    &:hover
        opacity: .9

    svg
        width: 18px
        height: 18px
        transform: rotate(180deg)
</style>