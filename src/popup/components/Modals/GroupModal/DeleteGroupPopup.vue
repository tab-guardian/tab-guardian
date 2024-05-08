<script setup lang="ts">
import Popup from '@/components/Popup.vue'
import { useTransStore } from '@/stores/useTransStore'

const { trans } = useTransStore()
</script>

<template>
    <Popup :content="trans('Do you want to delete the group?')">
        <template #buttons>
            <button type="button">Yes</button>
            <button type="button">No</button>
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