<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import { useSelectTabsStore } from '@/stores/selectTabs'
import { onMounted } from 'vue'
import Popup from '@/components/Popups/Popup.vue'
import Input from '@common/components/Form/Input.vue'
import Button from '@common/components/Form/Button.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import showToast from '@common/modules/showToast'

const { trans } = useTransStore()
const { closePopup, closeAllPopups } = usePopupStore()
const store = useGroupStore()
const selectTabsStore = useSelectTabsStore()

onMounted(() => {
    store.newGroup.name = ''
    store.newGroup.password = ''
})

function selectLinks(): void {
    if (store.newGroup.isPrivate && !store.newGroup.password) {
        showToast(trans('Password is empty'), 'error')
        return
    }

    closeAllPopups()

    selectTabsStore.showView({
        selectAll: true,
        operation: 'creating',
    })
}
</script>

<template>
    <Popup
        @cancel="closePopup('groupName')"
        :content="trans('Enter a group name')"
    >
        <form @submit.prevent="selectLinks" class="flex flex-col gap-3">
            <Input
                v-model="store.newGroup.name"
                type="text"
                id="new-group-name"
                :label="trans('Group name')"
                @loaded="inp => inp.focus()"
            />

            <Input
                v-if="store.newGroup.isPrivate"
                v-model="store.newGroup.password"
                type="password"
                id="group-password"
                :label="trans('Group password')"
            />

            <div>
                <Button type="submit">
                    {{ trans('Select Tabs') }}
                    <ChevronRightIcon width="20" height="20" />
                </Button>
            </div>
        </form>
    </Popup>
</template>
