<script setup lang="ts">
import { useTransStore } from '@/stores/useTransStore'
import FloppyIcon from '@/components/Icons/FloppyIcon.vue'

const { trans } = useTransStore()
</script>

<template>
    <div class="save-button">
        <button type="button">
            <FloppyIcon width="18" height="18" />
            {{ trans('Save') }}
        </button>
    </div>
</template>

<style lang="sass" scoped>
.save-button
    text-align: right
    margin-top: 8px

    button
        background-color: var(--tg-color-primary)
        color: var(--tg-color-bg)
        border: none
        padding: 8px 15px
        border-radius: 8px
        font-size: 1rem
        display: inline-flex
        align-items: center
        gap: 7px
        cursor: pointer
        transition: background-color .2s

        &:hover
            background-color: var(--tg-color-primary-hover)

        svg
            fill: var(--tg-color-bg)
</style>