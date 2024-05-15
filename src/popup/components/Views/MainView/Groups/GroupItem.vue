<script setup lang="ts">
import type { Group } from '@/types'
import ChevronRightIcon from '@/components/Icons/ChevronRightIcon.vue'
import ShieldCheckIcon from '@/components/Icons/ShieldCheckIcon.vue'
import ShieldExclamationIcon from '@/components/Icons/ShieldExclamationIcon.vue'
import OpenTabsButton from '@/components/Views/MainView/Groups/OpenTabsButton.vue'

type Props = {
    group: Group
}

const { group } = defineProps<Props>()
</script>

<template>
    <RouterLink
        :to="{ name: 'group', params: { id: group.id } }"
        :class="{
            'group--private': group.isPrivate && group.isEncrypted,
            'group--unsecure': group.isPrivate && !group.isEncrypted,
        }"
        class="group"
    >
        <div class="group__inner">
            <div v-if="group.isPrivate">
                <ShieldCheckIcon v-if="group.isEncrypted" class="shield" />
                <ShieldExclamationIcon v-else class="shield shield--unsecure" />
            </div>

            <div v-else class="amount">{{ group.links.length }}</div>

            <h2>{{ group.name }}</h2>
        </div>

        <div class="group__buttons">
            <OpenTabsButton v-if="!group.isEncrypted" :group />
            <ChevronRightIcon class="icon-right" />
        </div>
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

    &--unsecure
        background-color: var(--tg-color-bg-unsecure)

        &:hover
            background-color: var(--tg-color-bg-unsecure-hover)

    &__buttons
        display: flex
        align-items: center
        gap: 12px

    &__inner
        display: flex
        align-items: center
        gap: 12px

        .shield
            width: 25px
            height: 25px
            color: var(--tg-color-secondary)

            &--unsecure
                color: var(--tg-color-font)

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
