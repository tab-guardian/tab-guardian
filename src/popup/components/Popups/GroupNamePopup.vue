<script setup lang="ts">
import type { SelectTabsOperation } from '@common/types'
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { useNewGroupStore } from '@/stores/newGroup'
import { showToast } from '@common/modules/toast'
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { isNameTooLong } from '@common/modules/validation/group'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import BindToURL from '@/components/Popups/BindToURL.vue'
import NameInput from '@common/components/Form/NameInput.vue'
import PasswordFields from '@/components/PasswordFields.vue'

const popupStore = usePopupStore()
const newGroupStore = useNewGroupStore()
const router = useRouter()

const errors = reactive({
    password: false,
    url: false,
})

const preventSubmit = computed<boolean>(() => {
    return errors.password || errors.url
})

function submitName(): void {
    if (preventSubmit.value) {
        console.warn('Cannot submit because has some errors')
        return
    }

    if (newGroupStore.isPasswordEmpty()) {
        showToast({ text: trans('pass_empty'), type: 'error' })
        return
    }

    if (isNameTooLong(newGroupStore.choices.name)) {
        showToast({ text: trans('group_name_long'), type: 'error' })
        return
    }

    newGroupStore.choices.wantsSelectAllLinks = true

    popupStore.hide('groupName', {})

    const operation: SelectTabsOperation = 'creating'

    router.push({ name: 'select-tabs', params: { operation } })
}
</script>

<template>
    <Popup
        @cancel="popupStore.hide('groupName', {})"
        :content="trans('enter_group_name')"
    >
        <form @submit.prevent="submitName" class="flex flex-col gap-3">
            <NameInput
                v-model:name="newGroupStore.choices.name"
                @loaded="inp => inp.focus()"
            />

            <PasswordFields
                v-if="newGroupStore.choices.isPrivate"
                v-model:pass="newGroupStore.choices.password"
                v-model:confirm="newGroupStore.choices.confirmPassword"
                @has-error="hasErr => (errors.password = hasErr)"
            />

            <div>
                <BindToURL
                    v-if="newGroupStore.choices.isPrivate"
                    @url-error="hasErr => (errors.url = hasErr)"
                />

                <div class="flex justify-end">
                    <Button
                        type="submit"
                        :disabled="preventSubmit"
                        :icon="ChevronRightIcon"
                    >
                        {{ trans('select') }}
                    </Button>
                </div>
            </div>
        </form>
    </Popup>
</template>
