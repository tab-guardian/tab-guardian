<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSelectTabsStore } from '@/stores/selectTabs'
import { useTransStore } from '@/stores/trans'
import { useGroupStore } from '@/stores/group'
import View from '@/components/Views/View.vue'
import Tabs from '@/components/Views/SelectTabsView/Tabs.vue'
import SaveButton from '@/components/Views/SelectTabsView/SaveButton.vue'
import ControlButton from '@/components/Views/SelectTabsView/ControlButton.vue'

const { trans } = useTransStore()
const store = useSelectTabsStore()
const router = useRouter()
const groupStore = useGroupStore()
const subtitle = trans(
    'Click on each tab to select or unselect it for saving to memory',
)

onMounted(() => addEventListener('keydown', saveTabsAfterEnter))
onUnmounted(() => removeEventListener('keydown', saveTabsAfterEnter))

function saveTabsAfterEnter(e: Event): void {
    if (e instanceof KeyboardEvent && e.key === 'Enter') {
        saveTabs()
    }
}

function saveTabs(): void {
    let groupId = store.targetGroupId

    if (!groupId) {
        const newGroup = groupStore.createEmptyGroup()
        groupId = newGroup.id
        store.targetGroupId = newGroup.id
    }

    const selectedLinks = store.getSelectedLinks()

    groupStore.prependLinksTo(groupId, selectedLinks)

    if (groupStore.newGroup.isPrivate) {
        groupStore.encryptGroupById(groupId)
    }

    store.closeTabsModal()
}
</script>

<template>
    <View
        class="select-tabs"
        :title="trans('Select Tabs')"
        :subtitle="subtitle"
    >
        <div class="flex gap-1 my-2">
            <ControlButton @click="store.selectAll">
                {{ trans('Select all') }}
            </ControlButton>
            <ControlButton @click="store.deselectAll">
                {{ trans('Deselect all') }}
            </ControlButton>
            <ControlButton @click="router.go(-1)">
                {{ trans('Cancel') }}
            </ControlButton>
        </div>

        <Tabs />

        <SaveButton @clicked="saveTabs" />
    </View>
</template>
