<script setup lang="ts">
import type { Group, Link, SelectTabsOperation } from '@/types'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewGroupStore } from '@/stores/newGroup'
import { trans } from '@common/modules/trans'
import { useGroupStore } from '@/stores/group'
import { getCurrentLinks } from '@/modules/tabs/getCurrentLinks'
import { showToast } from '@common/modules/showToast'
import { error } from '@common/modules/error'
import View from '@/components/Views/View.vue'
import Tabs from '@/components/Views/SelectTabsView/Tabs.vue'
import SaveButton from '@/components/Views/SelectTabsView/SaveButton.vue'
import ControlButton from '@/components/Views/SelectTabsView/ControlButton.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'

const newGroupStore = useNewGroupStore()
const groupStore = useGroupStore()
const router = useRouter()
const route = useRoute()

const loading = ref<boolean>(false)
const links = ref<Link[]>([])
const operation = computed<SelectTabsOperation>(() => {
    return route.params.operation as SelectTabsOperation || 'adding'
})

onMounted(async () => await fetchLinks())

async function fetchLinks(): Promise<void> {
    loading.value = true

    links.value = await getCurrentLinks()

    if (newGroupStore.choices.wantsSelectAllLinks) {
        newGroupStore.selectAllLinks(links.value)
    }

    loading.value = false
}

async function handleCreateGroup(): Promise<void> {
    const group = await createGroup()

    if (!group) {
        error.warn(`Can't save group because it wasn't created`)
        return
    }

    await groupStore.saveGroup(group)

    await router.push({ name: 'group', params: { id: group.id } })

    newGroupStore.resetChoices()

    showToastMessage(group.links.length)
}

async function createGroup(): Promise<Group | null> {
    const group = newGroupStore.createGroupFromChoices()

    if (!newGroupStore.choices.isPrivate) {
        return group
    }

    const privateGroup = await createPrivateGroup(group)

    if (!privateGroup) {
        return null
    }

    return privateGroup
}

async function createPrivateGroup(group: Group): Promise<Group | null> {
    const encryptedGroup = await groupStore.encrypt(
        group,
        newGroupStore.choices.password || '',
        newGroupStore.choices.confirmPassword || '',
    )

    if (!encryptedGroup) {
        error.info(`Group ${group.id} wasn't encrypted`)
        return null
    }

    return group
}

function showToastMessage(linksLength: number): void {
    if (operation.value === 'adding' && linksLength === 0) {
        showToast(trans('you_not_selected_tabs'))
    } else if (operation.value === 'adding') {
        showToast(trans('tabs_added_to_group'))
    } else if (operation.value === 'creating' && linksLength === 0) {
        showToast(trans('group_created_without_tabs'))
    } else {
        showToast(trans('group_created_with_tabs'))
    }
}
</script>

<template>
    <View class="select-tabs" :title="trans('select')" :subtitle="trans('click_on_each_tab')">
        <div class="flex gap-1 my-2">
            <ControlButton @click="newGroupStore.selectAllLinks(links)">
                {{ trans('select_all') }}
            </ControlButton>
            <ControlButton @click="newGroupStore.deselectAllLinks">
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

            <SaveButton @clicked="handleCreateGroup">
                <span v-if="operation === 'adding'">
                    {{ trans('add_tabs') }}
                </span>
                <span v-else>{{ trans('create_group') }}</span>
            </SaveButton>
        </div>
    </View>
</template>
