<script setup lang="ts">
import { useSelectTabsModalStore } from '@/stores/modals/useSelectTabsModalStore'
import Spinner from '@/components/Spinner.vue'

const store = useSelectTabsModalStore()
</script>

<template>
    <Spinner v-if="store.loading" />

    <ul v-else>
        <li
            v-for="link in store.links"
            :key="link.id"
            class="link"
            :class="{ 'link--selected': store.selectedIds.includes(link.id) }"
            @click="store.toggleSelect(link.id)"
        >
            <div class="link__inner">
                <img :src="link.favIconUrl" alt="icon">
                <span>{{ link.title }}</span>
            </div>

            <label class="link__checkbox">
                <input type="checkbox">

                <div
                    v-if="store.selectedIds.includes(link.id)"
                    class="link__checkbox__checkmark"
                ></div>
            </label>
        </li>
    </ul>
</template>

<style lang="sass" scoped>
ul
    list-style: none
    padding: 0
    margin: 0
    display: flex
    flex-direction: column
    gap: 6px

    .link
        border: 1px solid var(--tg-color-border)
        padding: 7px 10px
        border-radius: 10px
        font-size: .9rem
        display: flex
        gap: 9px
        align-items: center
        justify-content: space-between
        transition: background-color .2s

        &:hover:not(&--selected)
            background-color: var(--tg-color-bg-secondary-hover)

        &--selected
            background-color: var(--tg-color-bg-private)

        &__inner
            display: flex
            align-items: center
            gap: 9px

            img
                width: 25px
                height: 25px
                border-radius: 4px

            span
                font-size: .8rem
                line-height: 1.1

        &__checkbox
            width: 16px
            height: 16px
            flex-shrink: 0
            background: var(--tg-color-bg-secondary)
            border: 1px solid var(--tg-color-border)
            border-radius: 4px
            display: flex
            align-items: center
            justify-content: center
            padding: 0

            input
                display: none

            &__checkmark
                width: 10px
                height: 10px
                background-color: var(--tg-color-secondary)
                border-radius: 3px
</style>