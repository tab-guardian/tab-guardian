<script setup lang="ts">
import { useGroupModalStore } from '@/stores/modals/useGroupModalStore';

const store = useGroupModalStore()

type Props = {
    title: string
}

const props = defineProps<Props>()
</script>

<template>
    <input
        v-if="store.isTitleFieldActive"
        type="text"
        v-model="store.newTitleField"
        autofocus
    >

    <h2 v-else>{{ props.title }}</h2>
</template>

<style lang="sass" scoped>
    h2, input
        font-size: 1rem
        margin: 4px 0
        padding: 4px

    h2
        border: 1px solid transparent

    input
        border: 1px solid var(--tg-color-border)
        border-radius: 5px
        background: var(--tg-color-bg-private)
        font-weight: bold
        width: 100%
        color: var(--tg-color)
</style>
