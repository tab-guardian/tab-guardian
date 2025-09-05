<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import { useRouter } from 'vue-router'
import { error } from '@common/modules/error'
import Popup from '@/components/Popups/Popup.vue'
import PopupButton from '@/components/Popups/PopupButton.vue'

const { closePopup } = usePopupStore()
const groupStore = useGroupStore()
const router = useRouter()

async function deleteGroup(): Promise<void> {
    if (!groupStore.selectedGroup) {
        error.warn('No group selected for deletion')
        return
    }

    await groupStore.deleteGroup(groupStore.selectedGroup.id)
    await router.push({ name: 'main' })

    closePopup('deleteGroup')

    groupStore.selectedGroup = null
}
</script>

<template>
    <Popup
        v-if="groupStore.selectedGroup"
        @cancel="closePopup('deleteGroup')"
        :content="trans('want_delete_group')"
    >
        <template #buttons>
            <PopupButton
                @click="closePopup('deleteGroup')"
                :isSecondary="true"
            >
                {{ trans('no') }}
            </PopupButton>

            <PopupButton @click="deleteGroup">
                {{ trans('yes') }}
            </PopupButton>
        </template>
    </Popup>
</template>
