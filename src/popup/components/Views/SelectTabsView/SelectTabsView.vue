<script setup lang="ts">
import type { SelectTabsOperation, Link } from '@/types'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSelectTabsStore } from '@/stores/selectTabs'
import trans from '@common/modules/trans'
import { useGroupStore } from '@/stores/group'
import showToast from '@common/modules/showToast'
import View from '@/components/Views/View.vue'
import Tabs from '@/components/Views/SelectTabsView/Tabs.vue'
import SaveButton from '@/components/Views/SelectTabsView/SaveButton.vue'
import ControlButton from '@/components/Views/SelectTabsView/ControlButton.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'

const store = useSelectTabsStore()
const router = useRouter()
const groupStore = useGroupStore()
const subtitle = trans('click_on_each_tab')

onMounted(() => addEventListener('keydown', saveTabsAfterEnter))
onUnmounted(() => removeEventListener('keydown', saveTabsAfterEnter))

function saveTabsAfterEnter(e: Event): void {
    if (e instanceof KeyboardEvent && e.key === 'Enter') {
        saveTabs()
        removeEventListener('keydown', saveTabsAfterEnter)
    }
}

async function saveTabs(): Promise<void> {
    let groupId = store.targetGroupId

    if (!groupId) {
        const newGroup = await groupStore.createEmptyGroup()
        groupId = newGroup.id
        store.targetGroupId = newGroup.id
    }

    const selectedLinks = store.getSelectedLinks()

    groupStore.prependLinksTo(groupId, selectedLinks)

    if (groupStore.newGroup.isPrivate) {
        await groupStore.encryptGroupById(
            groupId,
            groupStore.newGroup.password,
            groupStore.newGroup.confirmPassword,
        )
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
    <View class="select-tabs" :title="trans('select_tabs')" :subtitle="subtitle">
        <div class="flex gap-1 my-2">
            <ControlButton @click="store.selectAll">
                {{ trans('select_all') }}
            </ControlButton>
            <ControlButton @click="store.deselectAll">
                {{ trans('deselect_all') }}
            </ControlButton>
            <ControlButton @click="router.go(-1)">
                {{ trans('cancel') }}
            </ControlButton>
        </div>

        <Tabs />

        <div class="flex items-center justify-between gap-3 mt-3">
            <div class="text-right">
                <SlideSwitch v-model="groupStore.closeSelectedTabs">
                    {{ trans('Close selected tabs') }}
                </SlideSwitch>
            </div>

            <SaveButton @clicked="saveTabs">
                <span v-if="store.operation === 'adding'">
                    {{ trans('add_tabs') }}
                </span>
                <span v-else>{{ trans('Create the group') }}</span>
            </SaveButton>
        </div>
    </View>
</template>
