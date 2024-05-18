<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import error from '@common/modules/error'
import Popup from '@/components/Popups/Popup.vue'
import AppearTransition from '@common/components/Transitions/AppearTransition.vue'
import PopupButton from '@/components/Popups/PopupButton.vue'

const { trans } = useTransStore()
const { isOpenPopup, closePopup } = usePopupStore()
const store = useGroupStore()

function deleteGroup(): void {
    if (!store.selectedGroup) {
        error.warn('No group selected for deletion')
        return
    }

    store.deleteGroup(store.selectedGroup.id)

    closePopup('deleteGroup')

    store.selectedGroup = null
}
</script>

<template>
    <AppearTransition>
        <Popup
            v-if="store.selectedGroup && isOpenPopup('deleteGroup')"
            @confirm="deleteGroup"
            @cancel="closePopup('deleteGroup')"
            :content="trans('Do you want to delete the group?')"
        >
            <template #buttons>
                <PopupButton
                    @click="deleteGroup"
                    type="button"
                    class="popup__button"
                >
                    {{ trans('Yes') }}
                </PopupButton>

                <PopupButton
                    @click="closePopup('deleteGroup')"
                    type="button"
                    class="bg-private"
                >
                    {{ trans('No') }}
                </PopupButton>
            </template>
        </Popup>
    </AppearTransition>
</template>
