<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules/utils'
import { usePopupStore } from '@/stores/popup'
import { useRouter } from 'vue-router'
import { deletePasswordFromStorage } from '@common/modules/storage/password'
import Popup from '@/components/Popups/Popup.vue'
import PopupButton from '@/components/Popups/PopupButton.vue'

const { closePopup } = usePopupStore()
const groupStore = useGroupStore()
const router = useRouter()

async function deleteGroup(): Promise<void> {
    const group = groupStore.selectedGroup

    if (!group) {
        console.warn('No group selected for deletion')
        return
    }

    await groupStore.deleteGroup(group.id)
    await router.push({ name: 'main' })

    if (group.isPrivate) {
        await deletePasswordFromStorage(group.id)
    }

    closePopup('deleteGroup', {})

    groupStore.selectedGroup = null
}
</script>

<template>
    <Popup
        v-if="groupStore.selectedGroup"
        @cancel="closePopup('deleteGroup', {})"
        :content="trans('want_delete_group')"
    >
        <template #buttons>
            <PopupButton @click="closePopup('deleteGroup', {})" :is-secondary="true">
                {{ trans('no') }}
            </PopupButton>

            <PopupButton @click="deleteGroup">
                {{ trans('yes') }}
            </PopupButton>
        </template>
    </Popup>
</template>
