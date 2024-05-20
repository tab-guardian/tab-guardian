<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import { useSelectTabsStore } from '@/stores/selectTabs'
import Popup from '@/components/Popups/Popup.vue'
import AppearTransition from '@common/components/Transitions/AppearTransition.vue'
import InputField from '@common/components/Form/InputField.vue'

const { trans } = useTransStore()
const { isOpenPopup, closePopup, closeAllPopups } = usePopupStore()
const store = useGroupStore()
const selectTabsStore = useSelectTabsStore()

function selectLinks(): void {
    closeAllPopups()

    selectTabsStore.showView({
        selectAll: true,
        operation: 'creating',
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
            <InputField
                v-model="store.newGroup.name"
                type="text"
                class="mt-2"
                :placeholder="trans('Group name')"
                @loaded="inp => inp.focus()"
                @submit="selectLinks"
            >
                <span aria-hidden="true" aria-describedby="Enter">⏎</span>
            </InputField>
        </Popup>
    </AppearTransition>
</template>
