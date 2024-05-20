<script setup lang="ts">
import type { SelectTabsOperation, Link } from '@/types'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSelectTabsStore } from '@/stores/selectTabs'
import { useTransStore } from '@/stores/trans'
import { useGroupStore } from '@/stores/group'
import showToast from '@common/modules/showToast'
import View from '@/components/Views/View.vue'
import Tabs from '@/components/Views/SelectTabsView/Tabs.vue'
import SaveButton from '@/components/Views/SelectTabsView/SaveButton.vue'
import ControlButton from '@/components/Views/SelectTabsView/ControlButton.vue'
import Switch from '@common/components/Form/Switch.vue'

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
    showToastMessage(store.operation, selectedLinks)
}

function showToastMessage(operation: SelectTabsOperation, links: Link[]): void {
    if (operation === 'adding' && links.length === 0) {
        showToast(trans("You haven't selected any tabs"))
    } else if (operation === 'adding') {
        showToast(trans('Tabs added to the group'))
    } else if (operation === 'creating' && links.length === 0) {
        showToast(trans('Group created without any tabs selected'))
    } else {
        showToast(trans('Group created with tabs'))
    }
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

        <div class="flex items-center justify-between gap-3 mt-3">
            <div class="text-right">
                <Switch v-model="groupStore.closeSelectedTabs">
                    {{ trans('Close selected tabs') }}
                </Switch>
            </div>

            <SaveButton @clicked="saveTabs">
                <span v-if="store.operation === 'adding'">
                    {{ trans('Add tabs') }}
                </span>
                <span v-else>{{ trans('Create the group') }}</span>
            </SaveButton>
        </div>
    </View>
</template>
