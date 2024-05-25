<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import { useRouter } from 'vue-router'
import error from '@common/modules/error'
import Popup from '@/components/Popups/Popup.vue'
import PopupButton from '@/components/Popups/PopupButton.vue'

const { trans } = useTransStore()
const { closePopup } = usePopupStore()
const groupStore = useGroupStore()
const router = useRouter()

function deleteGroup(): void {
    if (!groupStore.selectedGroup) {
        error.warn('No group selected for deletion')
        return
    }

    groupStore.deleteGroup(groupStore.selectedGroup.id)

    closePopup('deleteGroup')

    groupStore.selectedGroup = null

    router.push({ name: 'main' })
}
</script>

<template>
    <Popup
        v-if="groupStore.selectedGroup"
        @cancel="closePopup('deleteGroup')"
        :content="trans('Do you want to delete the group?')"
    >
        <template #buttons>
            <PopupButton
                @click="closePopup('deleteGroup')"
                type="button"
                class="bg-private"
            >
                {{ trans('No') }}
            </PopupButton>

            <PopupButton
                @click="deleteGroup"
                type="button"
                class="popup__button"
            >
                {{ trans('Yes') }}
            </PopupButton>
        </template>
    </Popup>
</template>
