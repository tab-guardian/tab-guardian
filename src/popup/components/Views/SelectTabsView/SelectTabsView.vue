<script setup lang="ts">
import { useSelectTabsStore } from '@/stores/useSelectTabsStore'
import { useTransStore } from '@/stores/useTransStore'
import { useGroupStore } from '@/stores/useGroupStore'
import { useModalStore } from '@/stores/useModalStore'
import View from '@/components/Views/View.vue'
import Tabs from '@/components/Views/SelectTabsView/Tabs.vue'
import SaveButton from '@/components/Views/SelectTabsView/SaveButton.vue'

const { trans } = useTransStore()
const { closeModal } = useModalStore()
const store = useSelectTabsStore()
const groupStore = useGroupStore()
const subtitle = trans(
    'Click on each tab to select or unselect it for saving to memory',
)

async function saveTabs(): Promise<void> {
    let groupId = store.targetGroupId

    if (!groupId) {
        const newGroup = await groupStore.createEmptyGroup()
        groupId = newGroup.id
        store.targetGroupId = newGroup.id
    }

    const selectedLinks = store.getSelectedLinks()

    groupStore.prependLinksTo(groupId, selectedLinks)

    store.closeTabsModal()
}
</script>

<template>
    <View
        class="select-tabs"
        :title="trans('Select Tabs')"
        :subtitle="subtitle"
    >
        <div class="select-tabs__controls">
            <a href="javascript:" @click="store.selectAll">
                {{ trans('Select all') }}
            </a>
            <a href="javascript:" @click="store.deselectAll">
                {{ trans('Deselect all') }}
            </a>
            <a href="javascript:" @click="closeModal('selectTabs')">
                {{ trans('Cancel') }}
            </a>
        </div>

        <Tabs />

        <SaveButton @clicked="saveTabs" />
    </View>
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
