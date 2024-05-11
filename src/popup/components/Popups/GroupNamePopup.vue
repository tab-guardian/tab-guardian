<script setup lang="ts">
import { useGroupStore } from '@/stores/useGroupStore'
import { useTransStore } from '@/stores/useTransStore'
import { usePopupStore } from '@/stores/usePopupStore'
import { useSelectTabsStore } from '@/stores/useSelectTabsStore'
import Popup from '@/components/Popups/Popup.vue'
import AppearTransition from '@/components/Transitions/AppearTransition.vue'
import ChevronRightIcon from '@/components/Icons/ChevronRightIcon.vue'

const { trans } = useTransStore()
const { isOpenPopup, closePopup } = usePopupStore()
const store = useGroupStore()
const selectTabsStore = useSelectTabsStore()

function selectLinks(): void {
    closePopup('groupName')

    selectTabsStore.selectLinks({
        selectAll: true,
    })
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
            <template #buttons>
                <button @click="selectLinks" class="popup__button">
                    {{ trans('Select Tabs') }}
                    <ChevronRightIcon width="16" height="16" />
                </button>
            </template>

            <input
                v-model="store.newGroup.title"
                type="text"
                class="input"
                :placeholder="trans('Group name')"
                @keydown.enter="selectLinks"
                autofocus
            />
        </Popup>
    </AppearTransition>
</template>

<style scoped lang="sass">
input
    margin-top: 8px
</style>
