<script setup lang="ts">
import type { Link } from '@/types'

type Props = {
    link: Link
}

const props = defineProps<Props>()
</script>

<template>
    <li>
        <a
            :href="props.link.url"
            target="_blank"
            rel="noopener noreferrer"
        >
            <img :src="props.link.favIconUrl" alt="icon" />

            <span>
                {{ props.link.title }}
                <small>{{ props.link.url }}</small>
            </span>
        </a>
    </li>
</template>

<style lang="sass" scoped>
li
    a
        display: flex
        align-items: center
        gap: 10px
        background-color: #fff
        transition: background-color .2s
        cursor: pointer
        border: 1px solid var(--tg-color-border-default)
        border-radius: 8px
        background-color: var(--tg-color-light)
        padding: 8px
        text-decoration: none
        color: var(--tg-color-text-default)
        font-size: .9rem

        &:hover
            background-color: var(--tg-color-light-hover)

        img
            width: 25px
            height: 25px
            border-radius: 4px

        span
            display: flex
            flex-direction: column

            small
                color: var(--tg-color-text-gray)
</style>