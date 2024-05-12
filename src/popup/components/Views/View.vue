<script setup lang="ts">
import BackButton from '@/components/Views/GroupView/GroupControls/BackButton.vue'

type Props = {
    title?: string
    subtitle?: string
}

type Emits = {
    (e: 'goBack'): void
}

const emit = defineEmits<Emits>()
const { title, subtitle } = defineProps<Props>()
</script>

<template>
    <div class="modal">
        <div v-if="!title" class="modal__controls">
            <BackButton @click="emit('goBack')" />

            <div class="modal__controls__right">
                <slot name="controls" />
            </div>
        </div>

        <h2 v-if="title" class="modal__title">
            <BackButton @click="emit('goBack')" />

            {{ title }}
        </h2>

        <p v-if="subtitle" class="modal__subtitle">{{ subtitle }}</p>

        <slot></slot>
    </div>
</template>

<style lang="sass" scoped>
.modal
    position: absolute
    top: 0
    bottom: 0
    right: 0
    left: 0
    background-color: var(--tg-color-bg-secondary)
    padding: var(--tg-padding)

    &__controls
        display: flex
        justify-content: space-between
        gap: 2px

        &__right
            display: flex

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
