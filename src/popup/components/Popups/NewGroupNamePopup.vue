<script setup lang="ts">
import type { SelectTabsOperation } from '@/types'
import { trans } from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import { useNewGroupStore } from '@/stores/newGroup'
import { showToast } from '@common/modules/showToast'
import { useRouter } from 'vue-router'
import { isNameTooLong } from '@/modules/groupValidation'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import BindToUrlSlider from '@/components/Popups/BindToUrlSlider.vue'
import NameInput from '@common/components/Form/NameInput.vue'
import PasswordInput from '@common/components/Form/PasswordInput.vue'

const { closePopup, closeAllPopups } = usePopupStore()
const newGroupStore = useNewGroupStore()
const router = useRouter()

function submitName(): void {
    if (newGroupStore.preventPasswordSubmit) {
        console.info('Preventing password submit. Validation failed')
        return
    }

    if (newGroupStore.isPasswordEmpty()) {
        showToast(trans('password_empty'), 'error')
        return
    }

    if (isNameTooLong(newGroupStore.choices.name)) {
        showToast(trans('group_name_long'), 'error')
        return
    }

    newGroupStore.choices.wantsSelectAllLinks = true

    closeAllPopups()

    const operation: SelectTabsOperation = 'creating'

    router.push({ name: 'select-tabs', params: { operation } })
}
</script>

<template>
    <Popup
        @cancel="closePopup('newGroupName')"
        :content="trans('enter_group_name')"
    >
        <form @submit.prevent="submitName" class="flex flex-col gap-3">
            <NameInput
                v-model:name="newGroupStore.choices.name"
                @loaded="inp => inp.focus()"
            />

            <PasswordInput
                v-if="newGroupStore.choices.isPrivate"
                v-model="newGroupStore.choices.password"
                id="group-password"
                :label="trans('enter_pass')"
            />

            <PasswordInput
                v-if="newGroupStore.choices.isPrivate"
                v-model="newGroupStore.choices.confirmPassword"
                id="group-confirm-password"
                :label="trans('repeat_pass')"
                :error="newGroupStore.passwordErr"
            />

            <div class="flex items-end gap-3 justify-between">
                <BindToUrlSlider v-if="newGroupStore.choices.isPrivate" />
                <div v-else></div> <!-- keep this for flex justify between -->

                <Button
                    type="submit"
                    :disabled="newGroupStore.preventPasswordSubmit"
                    :icon="ChevronRightIcon"
                >
                    {{ trans('select') }}
                </Button>
            </div>
        </form>
    </Popup>
</template>
