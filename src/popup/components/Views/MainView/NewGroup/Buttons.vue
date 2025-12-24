<script setup lang="ts">
import type { SelectTabsOperation } from '@common/types'
import { useNewGroupStore } from '@/stores/newGroup'
import { getDefaultName, logger, trans } from '@common/modules'
import { useModalStore } from '@/stores/modal'
import { onMounted } from 'vue'
import { folderStorage } from '@common/modules/storage/folder'
import { showToast } from '@common/modules/toast'
import { useRouter } from 'vue-router'
import PlusCircleIcon from '@common/components/Icons/PlusCircleIcon.vue'
import FolderPlusIcon from '@common/components/Icons/FolderPlusIcon.vue'
import NewGroupButton from '@/components/Views/MainView/NewGroup/NewGroupButton.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'

const router = useRouter()
const modalStore = useModalStore()
const newGroupStore = useNewGroupStore()

onMounted(newGroupStore.resetChoices)

const emit = defineEmits<{ (e: 'refresh'): void }>()

async function askForGroupName(): Promise<void> {
    const resp = await modalStore.show('textInput', {
        label: trans('group_name'),
        title: trans('enter_group_name'),
        submitText: trans('next'),
        icon: ChevronRightIcon,
    })

    if (!resp || resp.canceled || !resp.name) {
        logger().info('Canceled entering group name')
        return
    }

    newGroupStore.choices.name = resp.name
    newGroupStore.choices.wantsSelectAllLinks = true
    newGroupStore.choices.isPrivate = await askForPrivateGroupCreation()

    if (!newGroupStore.choices.isPrivate) {
        moveToSelectTabsView()
        return
    }

    if (!await askForPassword()) {
        return
    }

    if (!await askToBindGroup()) {
        return
    }

    moveToSelectTabsView()
}

async function askForPrivateGroupCreation(): Promise<boolean> {
    const resp = await modalStore.show('confirm', {
        title: trans('make_private'),
        description: trans('do_you_want_private_group'),
    })

    return !!resp && resp.isConfirmed
}

async function askForPassword(): Promise<boolean> {
    const resp = await modalStore.show('newPassword', {
        title: trans('enter_pass'),
    })

    if (!resp || !resp.newPass) {
        logger().info('Cancled entering password name')
        return false
    }

    newGroupStore.choices.password = resp.newPass
    newGroupStore.choices.confirmPassword = resp.newPass

    return true
}

async function askToBindGroup(): Promise<boolean> {
    const confirmResp = await modalStore.show('confirm', {
        title: trans('bind_to_url'),
        description: trans('bind_group_url'),
    })

    if (!confirmResp || !confirmResp.isConfirmed) {
        logger().info('Not confirmed group bind URL')
        return true
    }

    const resp = await modalStore.show('bindGroup', {
        useCurrentUrl: true,
    })

    if (!resp || !resp.url) {
        logger().info('Canceled entering group bind URL')
        return false
    }

    newGroupStore.choices.bindUrl = resp.url

    return true
}

function moveToSelectTabsView(): void {
    const operation: SelectTabsOperation = 'creating'
    router.push({ name: 'select-tabs', params: { operation } })
}

async function showFolderModal(): Promise<void> {
    const resp = await modalStore.show('textInput', {
        label: trans('folder_name'),
        title: trans('enter_folder_name'),
        submitText: trans('create'),
    })

    if (!resp || resp.canceled) {
        logger().info('Cancled entering folder name')
        return
    }

    const folderName = resp.name || getDefaultName('Folder')
    await folderStorage.save(folderName)

    emit('refresh')

    showToast({ text: trans('folder_created') })
}
</script>

<template>
    <div class="flex items-center gap-2">
        <NewGroupButton
            @click="askForGroupName"
            class="w-full bg-primary hover:bg-primary-hover"
        >
            <PlusCircleIcon class="size-6" />
            <span>{{ trans('new_group') }}</span>
        </NewGroupButton>

        <NewGroupButton
            v-tippy="trans('create_new_folder')"
            @click="showFolderModal"
            class="w-20 bg-success hover:bg-success-hover"
        >
            <FolderPlusIcon class="size-6" />
        </NewGroupButton>
    </div>
</template>
