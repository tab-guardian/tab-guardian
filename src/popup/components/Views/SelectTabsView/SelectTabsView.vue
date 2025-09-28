<script setup lang="ts">
import type { Group, Link, SelectTabsOperation } from '@/types'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewGroupStore } from '@/stores/newGroup'
import { trans } from '@common/modules/trans'
import { useGroupStore } from '@/stores/group'
import { getCurrentLinks } from '@/modules/tabs/getCurrentLinks'
import { showToast } from '@common/modules/showToast'
import { VueDraggableNext } from 'vue-draggable-next'
import View from '@/components/Views/View.vue'
import TabItem from '@/components/Views/SelectTabsView/TabItem.vue'
import Message from '@common/components/Message.vue'
import Button from '@common/components/Form/Button.vue'
import ControlButton from '@/components/Views/SelectTabsView/ControlButton.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'
import Spinner from '@common/components/Spinner.vue'
import PlusIcon from '@common/components/Icons/PlusIcon.vue'

const newGroupStore = useNewGroupStore()
const groupStore = useGroupStore()
const router = useRouter()
const route = useRoute()

const loading = ref<boolean>(false)
const saving = ref<boolean>(false)
const links = ref<Link[]>([])
const selectedLinks = ref<Link[]>([])

const operation = computed<SelectTabsOperation>(() => {
    return route.params.operation as SelectTabsOperation || 'creating'
})

onUnmounted(() => removeEventListener('keydown', saveTabsAfterEnter))
onMounted(async () => {
    addEventListener('keydown', saveTabsAfterEnter)
    await fetchLinks()
})

async function saveTabsAfterEnter(e: Event): Promise<void> {
    if (e instanceof KeyboardEvent && e.key === 'Enter') {
        await handleCreateGroup()
    }
}

async function fetchLinks(): Promise<void> {
    loading.value = true

    links.value = await getCurrentLinks()

    if (newGroupStore.choices.wantsSelectAllLinks) {
        selectAllLinks()
    }

    loading.value = false
}

async function handleCreateGroup(): Promise<void> {
    const group = await createGroup()

    if (!group) {
        console.warn(`Can't save group because it wasn't created`)
        return
    }

    saving.value = true

    groupStore.groups.push(group)

    await groupStore.save(group)

    newGroupStore.resetChoices()

    showToastMessage()

    saving.value = false

    await router.push({ name: 'group', params: { id: group.id } })
}

async function handleSaveGroup(): Promise<void> {
    const group = groupStore.selectedGroup

    if (!group) {
        showToast(trans('error_no_group_selected'), 'error')
        return
    }

    saving.value = true

    await groupStore.saveLinksTo(group.id, selectedLinks.value)
    showToastMessage()

    saving.value = false

    await router.push({ name: 'group', params: { id: group.id } })
}

async function createGroup(): Promise<Group | null> {
    const group = newGroupStore.createGroupFromChoices(selectedLinks.value)

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
    const pass = newGroupStore.choices.password
    const confirm = newGroupStore.choices.confirmPassword

    if (!pass || !confirm) {
        console.error(`Password and confirm must not be empty`)
        return null
    }

    const encryptedGroup = await groupStore.encrypt(group, pass, confirm)

    if (!encryptedGroup) {
        console.info(`Group ${group.id} wasn't encrypted`)
        return null
    }

    return group
}

function showToastMessage(): void {
    const length = selectedLinks.value.length

    if (operation.value === 'adding' && length === 0) {
        showToast(trans('you_not_selected_tabs'))
    } else if (operation.value === 'adding') {
        showToast(trans('tabs_added_to_group'))
    } else if (operation.value === 'creating' && length === 0) {
        showToast(trans('group_created_without_tabs'))
    } else {
        showToast(trans('group_created_with_tabs'))
    }
}

function selectAllLinks(): void {
    selectedLinks.value = links.value
}

function deselectAllLinks(): void {
    selectedLinks.value = []
}

function toggleSelect(link: Link): void {
    const contains = selectedLinks.value.some(l => l.id === link.id)

    // Remove the link ID from selected if contains
    if (contains) {
        selectedLinks.value = selectedLinks.value.filter(l => l.id !== link.id)
        return
    }

    selectedLinks.value.push(link)
}
</script>

<template>
    <View :title="trans('select')" :subtitle="trans('click_on_each_tab')">
        <div class="flex gap-1 my-2">
            <ControlButton @click="selectAllLinks">
                {{ trans('select_all') }}
            </ControlButton>
            <ControlButton @click="deselectAllLinks">
                {{ trans('deselect_all') }}
            </ControlButton>
            <ControlButton @click="router.go(-1)">
                {{ trans('cancel') }}
            </ControlButton>
        </div>

        <Spinner v-if="loading" />

        <Message v-else-if="links.length === 0">
            {{ trans('no_tabs_found') }}
        </Message>

        <div v-else>
            <VueDraggableNext v-model="links" class="space-y-2">
                <TabItem
                    v-for="link in links"
                    :key="link.id"
                    :link
                    :isSelected="selectedLinks.some(l => l.id === link.id)"
                    @toggle="toggleSelect(link)"
                />
            </VueDraggableNext>
        </div>

        <div class="flex items-center justify-between gap-3 mt-3">
            <div class="text-right">
                <SlideSwitch v-model="groupStore.closeSelectedTabs">
                    {{ trans('close_selected_tabs') }}
                </SlideSwitch>
            </div>

            <Button
                v-if="operation === 'creating'"
                @clicked="handleCreateGroup"
                :loading="saving"
                :icon="PlusIcon"
            >
                {{ trans('create') }}
            </Button>

            <Button
                v-else-if="operation === 'adding'"
                @clicked="handleSaveGroup"
                :loading="saving"
                :icon="PlusIcon"
            >
                {{ trans('add_tabs') }}
            </Button>

            <span v-else>{{ trans('error_occurred') }}</span>
        </div>
    </View>
</template>
