<script setup lang="ts">
import { useNewGroupStore } from '@/stores/newGroup'
import { getDefaultName, trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { onMounted } from 'vue'
import { folderStorage } from '@common/modules/storage/folder'
import { showToast } from '@common/modules/toast'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import PlusCircleIcon from '@common/components/Icons/PlusCircleIcon.vue'
import FolderPlusIcon from '@common/components/Icons/FolderPlusIcon.vue'
import NewGroupButton from '@/components/Views/MainView/NewGroup/NewGroupButton.vue'

onMounted(() => newGroupStore.resetChoices())

const emit = defineEmits<{ (e: 'refresh'): void }>()

const popupStore = usePopupStore()
const newGroupStore = useNewGroupStore()

async function askForGroupName(isPrivate: boolean) {
    newGroupStore.choices.isPrivate = isPrivate
    await popupStore.show('groupName', {})
}

async function showFolderPopup(): Promise<void> {
    const res = await popupStore.show('textInput', {
        label: trans('folder_name'),
        title: trans('enter_folder_name'),
        submitText: trans('create'),
    })

    if (!res || res.canceled) {
        return
    }

    const folderName = res.name || getDefaultName('Folder')
    await folderStorage.save(folderName)

    emit('refresh')

    showToast({ text: trans('folder_created') })
}
</script>

<template>
    <div class="flex items-center gap-2">
        <NewGroupButton
            @click="askForGroupName(false)"
            class="w-full bg-primary hover:bg-primary-hover"
        >
            <PlusCircleIcon class="size-6" />
            <span>{{ trans('new_group') }}</span>
        </NewGroupButton>

        <NewGroupButton
            v-tippy="trans('private_groups_are_secure')"
            @click="askForGroupName(true)"
            class="w-24 bg-success hover:bg-success-hover"
        >
            <ShieldCheckIcon class="size-7" />
        </NewGroupButton>

        <button
            @click="showFolderPopup"
            class="w-14 flex justify-center hover:scale-105 transition-transform cursor-pointer"
            v-tippy="trans('create_new_folder')"
        >
            <FolderPlusIcon class="size-6 text-font" />
        </button>
    </div>
</template>
