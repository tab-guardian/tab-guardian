<script setup lang="ts">
import { onMounted } from 'vue'
import { getDefaultName, logger, trans } from '@common/modules'
import { useModalStore } from '@/stores/modal'
import { folderStorage } from '@common/modules/storage/folder'
import { showToast } from '@common/modules/toast'
import { useNewGroupStore } from '@/stores/newGroup'
import PlusCircleIcon from '@common/components/Icons/PlusCircleIcon.vue'
import FolderPlusIcon from '@common/components/Icons/FolderPlusIcon.vue'
import NewGroupButton from '@/components/Views/MainView/NewGroup/NewGroupButton.vue'

const modalStore = useModalStore()
const newGroupStore = useNewGroupStore()

onMounted(newGroupStore.resetChoices)

const emit = defineEmits<{ (e: 'refresh'): void }>()

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
            @click="newGroupStore.startGroupCreation"
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
