<script setup lang="ts">
import BackButton from '@/components/Views/GroupView/GroupControls/BackButton.vue'
import { useRouter } from 'vue-router'

type Props = {
    title?: string
    subtitle?: string
}

const router = useRouter()
const { title, subtitle } = defineProps<Props>()
</script>

<template>
    <div class="view">
        <div v-if="!title" class="view__controls">
            <BackButton @click="router.go(-1)" />

            <slot name="controls" />
        </div>

        <h2 v-if="title" class="view__title">
            <BackButton @click="router.go(-1)" />

            {{ title }}
        </h2>

        <p v-if="subtitle" class="view__subtitle">{{ subtitle }}</p>

        <slot></slot>
    </div>
</template>

<style lang="sass" scoped>
.view
    position: absolute
    top: 0
    bottom: 0
    right: 0
    left: 0
    background-color: var(--tg-page)
    padding: 12px

    &__controls
        display: flex
        justify-content: space-between
        gap: 2px

    &__title
        display: flex
        align-items: center
        gap: 6px
        margin: 0
        font-size: 1.2rem

    &__subtitle
        margin: 3px 0 0 0
        color: var(--tg-color-font-gray)
        font-size: .9rem

    &__btn
        background: none
        border: 1px solid transparent
        border-radius: 5px
        cursor: pointer
        padding: 2px

        &:hover
            background-color: var(--tg-color-bg-private)
            border-color: var(--tg-color-border)
</style>
