<script setup lang="ts">
import Popup from '@/components/Popup.vue'
import { useTransStore } from '@/stores/useTransStore'

type Emits = {
    (e: 'confirm'): void
    (e: 'cancel'): void
}

const emit = defineEmits<Emits>()
const { trans } = useTransStore()
</script>

<template>
    <Popup
        :content="trans('Do you want to delete the group?')"
        @cancel="emit('cancel')"
    >
        <template #buttons>
            <button @click="emit('cancel')" type="button">
                {{ trans('No') }}
            </button>

            <button @click="emit('confirm')" type="button">
                {{ trans('Yes') }}
            </button>
        </template>
    </Popup>
</template>

<style scoped lang="sass">
button
    border: 1px solid var(--tg-color-border-default)
    border-radius: 4px
    padding: 7px 20px
    font-size: .9rem
    cursor: pointer

    &:first-child
        background-color: var(--tg-color-secondary)
        color: var(--tg-color-light)

    &:last-child
        color: var(--tg-color-text-default)
        background-color: var(--tg-color-bg-light)
</style>
