<script setup lang="ts">
import type { Group } from '@common/types'
import { computed } from 'vue'
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import Popup from '@/components/Popups/Popup.vue'
import DeleteFolderMenuItem from '@/components/Popups/Folder/MenuItems/DeleteFolderMenuItem.vue'
import Message from '@common/components/Message.vue'

const popupStore = usePopupStore()
const groupStore = useGroupStore()
const group = computed<Group | null>(() => groupStore.selectedGroup)

const isEncrypted = computed<boolean>(() => {
    return group.value !== null && group.value.isEncrypted
})
</script>

<template>
    <Popup
        :content="trans('additional_options')"
        @cancel="popupStore.hide('groupMenu', {})"
    >
        <div v-if="group">
            <p
                v-if="isEncrypted"
                class="mt-2 pt-2 text-font-gray border-t border-border"
            >
                {{ trans('group_private_unlock_it') }}
            </p>

            <div v-else class="space flex flex-col gap-1 mt-3">
                <DeleteFolderMenuItem :group />
            </div>
        </div>

        <!-- If there is no selected group (edge case) -->
        <Message v-else>😢 {{ trans('error_no_group_selected') }}</Message>
    </Popup>
</template>
