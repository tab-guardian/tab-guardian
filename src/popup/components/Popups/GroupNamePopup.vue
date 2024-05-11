<script setup lang="ts">
import { useGroupStore } from '@/stores/useGroupStore'
import { useTransStore } from '@/stores/useTransStore'
import { usePopupStore } from '@/stores/usePopupStore'
import Popup from '@/components/Popups/Popup.vue'
import error from '@/modules/error'

const { trans } = useTransStore()
const { isOpenPopup, closePopup } = usePopupStore()
const store = useGroupStore()

function deleteGroup() {
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
    <Popup
        v-if="store.selectedGroup && isOpenPopup('deleteGroup')"
        @confirm="deleteGroup"
        @cancel="closePopup('deleteGroup')"
        :content="trans('Do you want to delete the group?')"
    >
        <template #buttons>
            <button @click="deleteGroup" type="button">
                {{ trans('Yes') }}
            </button>

            <button @click="closePopup('deleteGroup')" type="button">
                {{ trans('No') }}
            </button>
        </template>
    </Popup>
</template>

<style scoped lang="sass">
button
    border: 1px solid var(--tg-color-border)
    border-radius: 4px
    padding: 7px 20px
    font-size: .9rem
    cursor: pointer

    &:first-child
        background-color: var(--tg-color-secondary)
        color: var(--tg-color-bg-secondary)

    &:last-child
        color: var(--tg-color-font)
        background-color: var(--tg-color-bg)
</style>
