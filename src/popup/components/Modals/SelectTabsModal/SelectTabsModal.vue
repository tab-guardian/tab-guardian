<script setup lang="ts">
import { useSelectTabsModalStore } from '@/stores/modals/useSelectTabsModalStore'
import { useTransStore } from '@/stores/useTransStore'
import { useGroupStore } from '@/stores/useGroupStore'
import LeftSlideTransition from '@/components/Transitions/LeftSlideTransition.vue'
import Modal from '@/components/Modals/Modal.vue'
import Tabs from '@/components/Modals/SelectTabsModal/Tabs.vue'
import SaveButton from '@/components/Modals/SelectTabsModal/SaveButton.vue'

const store = useSelectTabsModalStore()
const groupStore = useGroupStore()
const { trans } = useTransStore()

function saveTabs(): void {
    if (!store.targetGroupId) {
        console.error(
            '[Tab Guardian]: targetGroupId is not set. Cannot save add links',
        )
        return
    }

    const selectedLinks = store.getSelectedLinks()

    groupStore.prependLinksTo(store.targetGroupId, selectedLinks)
    store.closeModal()
}
</script>

<template>
    <LeftSlideTransition>
        <Modal
            v-if="store.isOpen"
            class="select-tabs"
            :title="trans('Select Tabs')"
            :subtitle="
                trans(
                    'Click on each tab to select or unselect it for saving to memory',
                )
            "
        >
            <div class="select-tabs__controls">
                <a href="javascript:" @click="store.selectAll">
                    {{ trans('Select all') }}
                </a>
                <a href="javascript:" @click="store.deselectAll">
                    {{ trans('Deselect all') }}
                </a>
                <a href="javascript:" @click="store.closeModal">
                    {{ trans('Cancel') }}
                </a>
            </div>

            <Tabs />

            <SaveButton @click="saveTabs" />
        </Modal>
    </LeftSlideTransition>
</template>

<style lang="sass" scoped>
.select-tabs
    &__controls
        display: flex
        gap: 5px
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
