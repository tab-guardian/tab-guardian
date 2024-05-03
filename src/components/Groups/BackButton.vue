<script setup lang="ts">
import { useTransStore } from '@/stores/transStore'
import ChevronRightIcon from '@/components/Icons/ChevronRightIcon.vue'

const { trans } = useTransStore()
</script>

<template>
    <button
        class="back-button"
        type="button"
    >
        <ChevronRightIcon />
        {{ trans('Back') }}
    </button>
</template>

<style lang="sass" scoped>
.back-button
    display: flex
    align-items: center
    justify-content: center
    gap: 5px
    background: var(--dark-blue)
    color: #fff
    padding: 10px 18px
    border: none
    border-radius: 8px
    cursor: pointer

    &:hover
        background: var(--dark-blue-hover)

    svg
        width: 18px
        height: 18px
        transform: rotate(180deg)
</style>