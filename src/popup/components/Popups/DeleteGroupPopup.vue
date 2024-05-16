<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import error from '@common/modules/error'
import Popup from '@/components/Popups/Popup.vue'
import AppearTransition from '@common/components/Transitions/AppearTransition.vue'

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
                <button
                    @click="deleteGroup"
                    type="button"
                    class="popup__button"
                >
                    {{ trans('Yes') }}
                </button>

                <button
                    @click="closePopup('deleteGroup')"
                    type="button"
                    class="popup__button"
                >
                    {{ trans('No') }}
                </button>
            </template>
        </Popup>
    </AppearTransition>
</template>

<style scoped lang="sass">
button
    &:last-child
        color: var(--tg-color-font)
        background-color: var(--tg-color-bg)
</style>
