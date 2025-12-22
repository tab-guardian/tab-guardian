<script setup lang="ts">
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { useFolderStore } from '@/stores/folder'
import Popup from '@/components/Popups/Popup.vue'
import DeleteFolderMenuItem from '@/components/Popups/Folder/MenuItems/DeleteFolderMenuItem.vue'
import RenameFolderMenuItem from '@/components/Popups/Folder/MenuItems/RenameFolderMenuItem.vue'
import Message from '@common/components/Message.vue'

const popupStore = usePopupStore()
const folderStore = useFolderStore()
</script>

<template>
    <Popup
        :title="trans('additional_options')"
        @cancel="popupStore.hide('folderMenu', {})"
    >
        <div v-if="folderStore.folder">
            <div class="space flex flex-col gap-1 mt-3">
                <RenameFolderMenuItem :folder="folderStore.folder" />
                <DeleteFolderMenuItem :folder="folderStore.folder" />
            </div>
        </div>

        <Message v-else>😢 {{ trans('error_occurred') }}</Message>
    </Popup>
</template>
