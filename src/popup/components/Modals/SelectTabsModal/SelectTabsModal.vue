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
            <p>{{ trans('Select tabs that you want to include into the group') }}</p>

            <Tabs />
        </Modal>
    </LeftSlideTransition>
</template>

<style lang="sass" scoped>
.select-tabs
    h2
        margin: 0

    p
        margin: 4px 0 0 0
        color: var(--tg-color-font-gray)
        font-size: .9rem
</style>