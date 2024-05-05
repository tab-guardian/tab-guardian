<script setup lang="ts">
import { useTransStore } from '@/stores/useTransStore'
import Buttons from '@/components/Screens/MainScreen/QuickSave/Buttons.vue'

const { trans } = useTransStore()
</script>

<template>
    <div class="top">
        <Buttons />

        <small class="notice">
            {{ trans('Click the shield to save as a private group') }}
        </small>
    </div>
</template>

<style lang="sass" scoped>
.top
    text-align: center
    padding: var(--tg-padding)
    margin-bottom: 0
    border-bottom: 1px solid var(--tg-color-border-default)

    .notice
        display: block
        opacity: .8
        font-size: 12px
        font-family: 'Arial', sans-serif
        margin-top: 9px
</style>