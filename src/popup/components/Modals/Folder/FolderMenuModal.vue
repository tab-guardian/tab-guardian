<script setup lang="ts">
import { trans } from '@common/modules'
import { useModalStore } from '@/stores/modal'
import { useFolderStore } from '@/stores/folder'
import Modal from '@/components/Modals/Modal.vue'
import DeleteFolderMenuItem from '@/components/Modals/Folder/MenuItems/DeleteFolderMenuItem.vue'
import RenameFolderMenuItem from '@/components/Modals/Folder/MenuItems/RenameFolderMenuItem.vue'
import Message from '@common/components/Message.vue'

const modalStore = useModalStore()
const folderStore = useFolderStore()
</script>

<template>
    <Modal
        :title="trans('additional_options')"
        @cancel="modalStore.hide('folderMenu', {})"
    >
        <div v-if="folderStore.folder">
            <div class="space flex flex-col gap-1 mt-3">
                <RenameFolderMenuItem :folder="folderStore.folder" />
                <DeleteFolderMenuItem :folder="folderStore.folder" />
            </div>
        </div>

        <Message v-else>😢 {{ trans('error_occurred') }}</Message>
    </Modal>
</template>
