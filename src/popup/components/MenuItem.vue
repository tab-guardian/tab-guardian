<script setup lang="ts">
type Props = {
    title: string
}

const { title } = defineProps<Props>()
</script>

<template>
    <div class="menu-item">
        <slot />
        <span>{{ title }}</span>
    </div>
</template>

<style lang="sass" scoped>
.menu-item
    padding: 6px 10px
    background-color: var(--tg-color-page)
    border-radius: 7px
    border: 1px solid var(--tg-color-border)
    display: flex
    align-items: center
    gap: 7px
    cursor: pointer
    transition: border-color .1s, color .1s

    &:hover
        border-color: var(--tg-color-primary)
        color: var(--tg-color-primary)

    span
        font-size: .9rem
        color: var(--tg-color-text)
</style>
