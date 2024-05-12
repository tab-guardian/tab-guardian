<script setup lang="ts">
import type { Group } from '@/types'
import ChevronRightIcon from '@/components/Icons/ChevronRightIcon.vue'
import ShieldCheckIcon from '@/components/Icons/ShieldCheckIcon.vue'

type Props = {
    group: Group
}

const { group } = defineProps<Props>()
</script>

<template>
    <RouterLink
        :to="{ name: 'group', params: { id: group.id } }"
        :class="{ 'group--private': group.isPrivate }"
        class="group"
    >
        <div class="group__inner">
            <ShieldCheckIcon v-if="group.isPrivate" class="shield" />
            <div v-else class="amount">{{ group.links.length }}</div>

            <h2>{{ group.title }}</h2>
        </div>

        <ChevronRightIcon class="icon-right" />
    </RouterLink>
</template>

<style lang="sass" scoped>
.group
    padding: 10px 8px 10px 10px
    display: flex
    justify-content: space-between
    align-items: center
    gap: 10px
    transition: background-color .2s
    text-decoration: none
    color: var(--tg-color-font)
    cursor: pointer
    border-bottom: 1px solid var(--tg-color-border)
    background-color: var(--tg-color-bg-secondary)

    &:hover
        background-color: var(--tg-color-bg-secondary-hover)

    &--private
        background-color: var(--tg-color-bg-private)

        &:hover
            background-color: var(--tg-color-bg-private-hover)

    &__inner
        display: flex
        align-items: center
        gap: 12px

        .shield
            width: 25px
            height: 25px
            color: var(--tg-color-secondary)

    h2
        font-size: .9rem
        margin: 0

    .amount
        width: 23px
        height: 23px
        color: var(--tg-color-primary)
        display: flex
        justify-content: center
        align-items: center
        font-size: 16px

    .icon-right
        width: 20px
        height: 20px
</style>