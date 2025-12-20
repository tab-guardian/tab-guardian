<script setup lang="ts">
import type { Folder } from '@common/types'
import { computed } from 'vue'
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { useFolderStore } from '@/stores/folder'
import { useRoute } from 'vue-router'
import Popup from '@/components/Popups/Popup.vue'
import DeleteFolderMenuItem from '@/components/Popups/Folder/MenuItems/DeleteFolderMenuItem.vue'
import RenameFolderMenuItem from '@/components/Popups/Folder/MenuItems/RenameFolderMenuItem.vue'
import Message from '@common/components/Message.vue'

const popupStore = usePopupStore()
const folderStore = useFolderStore()
const route = useRoute()

const folder = computed<Folder | null>(() => {
    const id = route.params.id
    const parsedId = id ? Number(id) : null
    return folderStore.folders.find(f => f.id == parsedId) || null
})
</script>

<template>
    <Popup
        :content="trans('additional_options')"
        @cancel="popupStore.hide('folderMenu', {})"
    >
        <div v-if="folder">
            <div class="space flex flex-col gap-1 mt-3">
                <RenameFolderMenuItem :folder />
                <DeleteFolderMenuItem :folder />
            </div>
        </div>

        <Message v-else>😢 {{ trans('error_occurred') }}</Message>
    </Popup>
</template>
