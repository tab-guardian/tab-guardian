<script setup lang="ts">
import type { Link } from '@/types'
import MoreButton from '@/components/Modals/GroupModal/MoreButton.vue'

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
            <div class="group-item--inner">
                <img :src="props.link.favIconUrl" alt="icon" />

                <div class="group-item__content">
                    {{ props.link.title }}
                    <small>{{ props.link.url }}</small>
                </div>
            </div>

            <MoreButton />
        </a>
    </li>
</template>

<style lang="sass" scoped>
.group-item
    a
        display: flex
        align-items: center
        justify-content: space-between
        gap: 8px
        background-color: #fff
        transition: background-color .2s
        cursor: pointer
        border: 1px solid var(--tg-color-border)
        border-radius: 8px
        background-color: var(--tg-color-bg-secondary)
        padding: 8px
        text-decoration: none
        color: var(--tg-color-font)
        font-size: .9rem

        &:hover
            background-color: var(--tg-color-bg-secondary-hover)

        img
            width: 25px
            height: 25px
            border-radius: 4px

    &__content
        display: flex
        flex-direction: column
        line-height: 1.15

        small
            color: var(--tg-color-font-gray)

    &--inner
        display: flex
        gap: 9px
        align-items: center
</style>
