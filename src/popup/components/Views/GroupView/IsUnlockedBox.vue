<script setup lang="ts">
import type { Group } from '@/types'
import ShieldExclamationIcon from '@/components/Icons/ShieldExclamationIcon.vue'
import { useTransStore } from '@/stores/trans'

type Props = {
    group: Group
}

const { group } = defineProps<Props>()
const { trans } = useTransStore()

function lockGroup(): void {
    console.log('Lock group')
}
</script>

<template>
    <div class="unsecure">
        <ShieldExclamationIcon />
        <span>{{ trans('This private group is unlocked') }}</span>

        <button @click="lockGroup">
            {{ trans('Lock') }}
        </button>
    </div>
</template>

<style lang="sass" scoped>
.unsecure
    display: flex
    align-items: center
    justify-content: space-between
    margin-bottom: 10px
    background-color: rgb(184 32 32 / 16%)
    padding: 8px 10px
    border-radius: 7px

    svg
        width: 25px
        height: 25px

    span
        font-size: .85rem

    button
        border: none
        padding: 7px 15px
        border-radius: 5px
        background-color: var(--tg-color-bg-unsecure)
        transition: background-color .2s
        color: var(--tg-color-font)
        cursor: pointer

        &:hover
            background-color: var(--tg-color-bg-unsecure-hover)
</style>
