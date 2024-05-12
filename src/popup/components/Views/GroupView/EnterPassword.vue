<script setup lang="ts">
import type { Group } from '@/types'
import { useTransStore } from '@/stores/useTransStore'
import ShieldCheckIcon from '@/components/Icons/ShieldCheckIcon.vue'
import ArrowRight from '@/components/Icons/ArrowRight.vue'

type Props = {
    group: Group
}

const { group } = defineProps<Props>()
const { trans } = useTransStore()
</script>

<template>
    <div class="enter-pass">
        <p class="enter-pass__heading">
            <ShieldCheckIcon width="40" height="40" />
            {{ trans('Enter a password to decrypt the content of this group') }}
        </p>

        <div class="enter-pass__inner">
            <input
                type="password"
                class="input"
                :placeholder="trans('Enter a password')"
            />

            <button type="button">
                <ArrowRight width="20" height="20" />
            </button>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.enter-pass
    &__heading
        font-size: .9rem
        display: flex
        align-items: center
        gap: 10px

    &__inner
        display: flex
        align-items: center
        gap: 10px

        button
            background-color: var(--tg-color-primary)
            border: none
            transition: background-color .2s
            height: 29px
            border-radius: 5px
            flex: 1
            display: flex
            align-items: center
            justify-content: center
            cursor: pointer

            &:hover
                background-color: var(--tg-color-primary-hover)
</style>
