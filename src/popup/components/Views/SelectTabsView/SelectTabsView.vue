<script setup lang="ts">
import type { SelectTabsOperation, Link } from '@/types'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSelectTabsStore } from '@/stores/selectTabs'
import { trans } from '@common/modules/trans'
import { useGroupStore } from '@/stores/group'
import { showToast } from '@common/modules/showToast'
import View from '@/components/Views/View.vue'
import Tabs from '@/components/Views/SelectTabsView/Tabs.vue'
import SaveButton from '@/components/Views/SelectTabsView/SaveButton.vue'
import ControlButton from '@/components/Views/SelectTabsView/ControlButton.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'

const store = useSelectTabsStore()
const router = useRouter()
const groupStore = useGroupStore()

onMounted(() => addEventListener('keydown', saveTabsAfterEnter))
onUnmounted(() => removeEventListener('keydown', saveTabsAfterEnter))

async function saveTabsAfterEnter(e: Event): Promise<void> {
    if (e instanceof KeyboardEvent && e.key === 'Enter') {
        removeEventListener('keydown', saveTabsAfterEnter)
        await saveTabs()
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

    await groupStore.prependLinksTo(groupId, selectedLinks)

    const pass = groupStore.newGroup.password
    const confirm = groupStore.newGroup.confirmPassword

    if (groupStore.newGroup.isPrivate) {
        await groupStore.encryptGroupById(groupId, pass, confirm)
    }

    store.closeTabsModal()
    groupStore.resetNewGroup()

    showToastMessage(store.operation, selectedLinks)
}

function showToastMessage(operation: SelectTabsOperation, links: Link[]): void {
    if (operation === 'adding' && links.length === 0) {
        showToast(trans('you_not_selected_tabs'))
    } else if (operation === 'adding') {
        showToast(trans('tabs_added_to_group'))
    } else if (operation === 'creating' && links.length === 0) {
        showToast(trans('group_created_without_tabs'))
    } else {
        showToast(trans('group_created_with_tabs'))
    }
}
</script>

<template>
    <View
        class="select-tabs"
        :title="trans('select')"
        :subtitle="trans('click_on_each_tab')"
    >
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
                    {{ trans('close_selected_tabs') }}
                </SlideSwitch>
            </div>

            <SaveButton @clicked="saveTabs">
                <span v-if="store.operation === 'adding'">
                    {{ trans('add_tabs') }}
                </span>
                <span v-else>{{ trans('create_group') }}</span>
            </SaveButton>
        </div>
    </View>
</template>
