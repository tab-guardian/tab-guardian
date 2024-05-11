<script setup lang="ts">
import { useGroupModalStore } from '@/stores/modals/useGroupModalStore'
import { useGroupStore } from '@/stores/useGroupStore'
import { useTransStore } from '@/stores/useTransStore'
import { usePopupStore } from '@/stores/usePopupStore'
import Popup from '@/components/Popups/Popup.vue'

const { trans } = useTransStore()
const { isOpen, close } = usePopupStore()
const groupModalStore = useGroupModalStore()
const groupStore = useGroupStore()

function deleteGroup() {
    if (!groupModalStore.selectedGroup) {
        console.warn('[Tab Guardian]: No group selected for deletion')
        return
    }

    groupStore.deleteGroup(groupModalStore.selectedGroup.id)

    close('deleteGroup')

    groupModalStore.selectedGroup = null
}
</script>

<template>
    <Popup
        v-if="groupModalStore.selectedGroup && isOpen('deleteGroup')"
        @confirm="deleteGroup"
        @cancel="close('deleteGroup')"
        :content="trans('Do you want to delete the group?')"
    >
        <template #buttons>
            <button @click="deleteGroup" type="button">
                {{ trans('Yes') }}
            </button>

            <button @click="close('deleteGroup')" type="button">
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
