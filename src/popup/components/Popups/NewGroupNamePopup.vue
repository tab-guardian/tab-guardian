<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import trans from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import { useSelectTabsStore } from '@/stores/selectTabs'
import showToast from '@common/modules/showToast'
import Popup from '@/components/Popups/Popup.vue'
import Input from '@common/components/Form/Input.vue'
import Button from '@common/components/Form/Button.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import BindToUrlSlider from '@/components/Popups/BindToUrlSlider.vue'

const { closePopup, closeAllPopups } = usePopupStore()
const store = useGroupStore()
const selectTabsStore = useSelectTabsStore()

const passwordErr = computed<string>(() => {
    return store.newGroup.confirmPassword.length > 0 &&
        store.newGroup.password !== store.newGroup.confirmPassword
        ? trans('passwords_not_match')
        : ''
})

const preventSubmit = computed<boolean>(() => {
    if (!store.newGroup.isPrivate) {
        return !store.newGroup.name
    }

    return (
        !!passwordErr.value ||
        !store.newGroup.password ||
        !store.newGroup.confirmPassword
    )
})

onMounted(async () => {
    store.newGroup.name = ''
    store.newGroup.password = ''
})

function selectLinks(): void {
    if (preventSubmit.value) {
        return
    }

    if (store.newGroup.isPrivate && !store.newGroup.password) {
        showToast(trans('Password is empty'), 'error')
        return
    }

    if (store.groupNameLength > store.groupNameMaxLength) {
        showToast(trans('Group name is too long'), 'error')
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
    <Popup @cancel="closePopup('groupName')" :content="trans('enter_group_name')">
        <form @submit.prevent="selectLinks" class="flex flex-col gap-3">
            <Input
                v-model="store.newGroup.name"
                :label="trans('group_name')"
                @loaded="inp => inp.focus()"
                :meta="`${store.groupNameLength} / ${store.groupNameMaxLength}`"
                :maxlength="store.groupNameMaxLength"
                type="text"
                id="new-group-name"
            />

            <Input
                v-if="store.newGroup.isPrivate"
                v-model="store.newGroup.password"
                type="password"
                id="group-password"
                :label="trans('enter_pass')"
            />

            <Input
                v-if="store.newGroup.isPrivate"
                v-model="store.newGroup.confirmPassword"
                type="password"
                id="group-confirm-password"
                :label="trans('repeat_pass')"
                :error="passwordErr"
            />

            <div class="flex items-end gap-3 justify-between">
                <BindToUrlSlider v-if="store.newGroup.isPrivate" />
                <div v-else></div>

                <Button type="submit" :disabled="preventSubmit">
                    {{ trans('select_tabs') }}
                    <ChevronRightIcon width="20" height="20" />
                </Button>
            </div>
        </form>
    </Popup>
</template>
