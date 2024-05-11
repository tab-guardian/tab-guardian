<script setup lang="ts">
import { useGroupStore } from '@/stores/useGroupStore'
import { useTransStore } from '@/stores/useTransStore'
import { usePopupStore } from '@/stores/usePopupStore'
import Popup from '@/components/Popups/Popup.vue'
import error from '@/modules/error'
import AppearTransition from '@/components/Transitions/AppearTransition.vue'

const { trans } = useTransStore()
const { isOpenPopup, closePopup } = usePopupStore()
const store = useGroupStore()

function selectLinks(): void {
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
            v-if="isOpenPopup('groupName')"
            @confirm="selectLinks"
            @cancel="closePopup('groupName')"
            :content="trans('Enter a group name')"
        >
            <template #buttons> </template>
        </Popup>
    </AppearTransition>
</template>

<style scoped lang="sass"></style>
