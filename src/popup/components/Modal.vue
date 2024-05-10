<script setup lang="ts">
type Props = {
    title?: string
    subtitle?: string
}

const { title, subtitle } = defineProps<Props>()
</script>

<template>
    <div class="modal">
        <h2 v-if="title" class="modal__title">{{ title }}</h2>
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

    &__title
        margin: 0
        font-size: 1.3rem

    &__subtitle
        margin: 4px 0 0 0
        color: var(--tg-color-font-gray)
        font-size: .9rem
</style>