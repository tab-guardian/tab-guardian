<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { trans } from '@common/modules'
import { useModalStore } from '@/stores/modal'
import { useFolderStore } from '@/stores/folder'
import { useNewGroupStore } from '@/stores/newGroup'
import { useRouter } from 'vue-router'
import Modal from '@/components/Modals/Modal.vue'
import DeleteFolderMenuItem from '@/components/Modals/Folder/MenuItems/DeleteFolderMenuItem.vue'
import RenameFolderMenuItem from '@/components/Modals/Folder/MenuItems/RenameFolderMenuItem.vue'
import Message from '@common/components/Message.vue'
import MenuItem from '@/components/MenuItem.vue'
import PlusIcon from '@common/components/Icons/PlusIcon.vue'

const modalStore = useModalStore()
const folderStore = useFolderStore()
const newGroupStore = useNewGroupStore()
const router = useRouter()

const folder = computed(() => folderStore.selectedFolder)

onMounted(newGroupStore.resetChoices)

async function createGroup(): Promise<void> {
    modalStore.hide('folderMenu', {})
    await newGroupStore.startGroupCreation(router, folder.value?.id)
}
</script>

<template>
    <Modal
        :title="trans('additional_options')"
        @cancel="modalStore.hide('folderMenu', {})"
    >
        <div v-if="folder">
            <div class="space flex flex-col gap-1 mt-3">
                <MenuItem
                    @click="createGroup"
                    :label="trans('new_group')"
                    :icon="PlusIcon"
                />

                <RenameFolderMenuItem :folder />
                <DeleteFolderMenuItem :folder />
            </div>
        </div>

        <Message v-else>😢 {{ trans('error_occurred') }}</Message>
    </Modal>
</template>
