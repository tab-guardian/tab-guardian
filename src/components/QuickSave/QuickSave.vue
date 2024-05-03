<script setup lang="ts">
import { useTransStore } from '@/stores/transStore'
import Buttons from '@/components/QuickSave/Buttons.vue'

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

    .notice
        display: block
        opacity: .7
        font-size: 12px
        font-family: 'Arial', sans-serif
        margin-top: 8px
</style>