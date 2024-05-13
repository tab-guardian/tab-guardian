<script setup lang="ts">
import { useTransStore } from '@/stores/trans'

type Props = {
    message: string
}

type Emits = {
    (e: 'confirm'): void
}

const emit = defineEmits<Emits>()
const { trans } = useTransStore()
const { message } = defineProps<Props>()
</script>

<template>
    <div class="notice">
        <p>{{ message }}</p>

        <div class="notice__button">
            <button @click="emit('confirm')" type="button">
                {{ trans('Got it') }}
            </button>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.notice
    background-color: rgb(208 209 91 / 20%)
    padding: 14px
    border-radius: 6px
    font-size: .9rem
    margin: 7px 0

    p
        margin: 0

    &__button
        text-align: right

        button
            border: none
            background-color: rgb(208 209 91 / 40%)
            color: var(--tg-color-font)
            padding: 6px 12px
            border-radius: 4px
            cursor: pointer
            transition: background-color .2s

            &:hover
                background-color: rgb(208 209 91 / 45%)
</style>
