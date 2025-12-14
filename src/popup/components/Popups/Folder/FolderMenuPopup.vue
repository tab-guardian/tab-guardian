<script setup lang="ts">
import { computed } from 'vue'
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { useRoute } from 'vue-router'
import Popup from '@/components/Popups/Popup.vue'
import DeleteFolderMenuItem from '@/components/Popups/Folder/MenuItems/DeleteFolderMenuItem.vue'
import Message from '@common/components/Message.vue'

const popupStore = usePopupStore()
const route = useRoute()

const folderId = computed<number | null>(() => {
    const id = route.params.id
    return id ? Number(id) : null
})
</script>

<template>
    <Popup
        :content="trans('additional_options')"
        @cancel="popupStore.hide('folderMenu', {})"
    >
        <div v-if="folderId">
            <div class="space flex flex-col gap-1 mt-3">
                <DeleteFolderMenuItem :folder-id="folderId" />
            </div>
        </div>

        <Message v-else>😢 {{ trans('error_occurred') }}</Message>
    </Popup>
</template>
