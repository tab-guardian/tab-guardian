<script setup lang="ts">
import LeftSlideTransition from '@/components/Transitions/LeftSlideTransition.vue'
import Modal from '@/components/Modal.vue'
import Tabs from '@/components/Modals/SelectTabsModal/Tabs.vue'
import { useSelectTabsModalStore } from '@/stores/modals/useSelectTabsModalStore'
import { useTransStore } from '@/stores/useTransStore'

const store = useSelectTabsModalStore()
const { trans } = useTransStore()
</script>

<template>
    <LeftSlideTransition>
        <Modal v-if="store.isOpen" class="select-tabs">
            <h2>{{ trans('Select Tabs') }}</h2>
            <p>
                {{ trans('Click on each tab to select or unselect it for saving to memory') }}.
            </p>

            <div class="select-tabs__controls">
                <a href="javascript:" @click="store.selectAll">
                    {{ trans('Select all') }}
                </a>
                <a href="javascript:" @click="store.deselectAll">
                    {{ trans('Deselect all') }}
                </a>
                <a href="javascript:" @click="store.close">
                    {{ trans('Cancel') }}
                </a>
            </div>

            <Tabs />
        </Modal>
    </LeftSlideTransition>
</template>

<style lang="sass" scoped>
.select-tabs
    h2
        margin: 0
        font-size: 1.3rem

    p
        margin: 4px 0 0 0
        color: var(--tg-color-font-gray)
        font-size: .9rem

    &__controls
        display: flex
        gap: 7px
        margin: 8px 0

        a
            text-decoration: none
            color: var(--tg-color-secondary)
            font-size: .9rem
            border-radius: 5px
            border: 1px solid var(--tg-color-border)
            padding: 2px 5px
            transition: background-color .2s
            flex: 1
            text-align: center

            &:hover
                background-color: var(--tg-color-bg-private)
</style>