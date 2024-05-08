<script setup lang="ts">
import type { Link } from '@/types'

type Props = {
    link: Link
}

const props = defineProps<Props>()
</script>

<template>
    <li :title="props.link.title" class="group-item">
        <a
            :href="props.link.url"
            target="_blank"
            rel="noopener noreferrer"
        >
            <img :src="props.link.favIconUrl" alt="icon" />

            <span class="group-item__content">
                <span>{{ props.link.title }}</span>
                <small>{{ props.link.url }}</small>
            </span>
        </a>
    </li>
</template>

<style lang="sass" scoped>
.group-item
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

    &__content
        display: flex
        flex-direction: column
        min-width: 0

        small
            color: var(--tg-color-text-gray)

        span
            display: block
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
</style>