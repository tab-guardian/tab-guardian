<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

type Props = {
    to?: RouteLocationRaw
}

const { to } = defineProps<Props>()
</script>

<template>
    <RouterLink v-if="to" :to>
        <slot />
    </RouterLink>

    <button type="button" v-else>
        <slot />
    </button>
</template>

<style lang="sass" scoped>
button, a
    width: 30px
    height: 30px
    display: flex
    justify-content: center
    align-items: center
    border: 1px solid transparent
    color: var(--tg-color-font)
    border-radius: 5px
    padding: 2px
    opacity: .9
    transition: opacity .2s, border-color .2s
    cursor: pointer

    &:hover
        opacity: 1
        border-color: var(--tg-color-border)
</style>
