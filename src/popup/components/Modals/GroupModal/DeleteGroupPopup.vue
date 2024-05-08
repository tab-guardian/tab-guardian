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
            <button @click="emit('confirm')" type="button">{{ trans('Yes') }}</button>
            <button @click="emit('cancel')" type="button">{{ trans('No') }}</button>
        </template>
    </Popup>
</template>

<style scoped lang="sass">
button
    border: none
    border-radius: 4px
    padding: 7px 20px
    font-size: .9rem
    cursor: pointer
</style>
