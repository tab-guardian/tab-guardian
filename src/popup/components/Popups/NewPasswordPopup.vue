<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import trans from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import Popup from '@/components/Popups/Popup.vue'
import Input from '@common/components/Form/Input.vue'
import Button from '@common/components/Form/Button.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'

const { closePopup, closeAllPopups } = usePopupStore()
const store = useGroupStore()

const pass = ref<string>('')
const confirmPass = ref<string>('')

const passwordErr = computed<string>(() => {
    return confirmPass.value.length > 0 && pass.value !== confirmPass.value
        ? trans('passwords_not_match')
        : ''
})

const preventPasswordSubmit = computed<boolean>(() => {
    return !!passwordErr.value || !pass.value || !confirmPass.value
})

function updatePassword(): void {
    store.updatePassword(pass.value)
    // todo: complete here
}
</script>

<template>
    <Popup @cancel="closePopup('newPassword')" :content="trans('enter_new_pass')">
        <form @submit.prevent="updatePassword" class="flex flex-col gap-3">
            <Input
                v-model="pass"
                type="password"
                id="group-password"
                :label="trans('enter_pass')"
            />

            <Input
                v-model="confirmPass"
                type="password"
                id="group-confirm-password"
                :label="trans('repeat_pass')"
                :error="passwordErr"
            />

            <div class="flex items-end gap-3 justify-between">
                <Button type="submit" :disabled="preventPasswordSubmit">
                    {{ trans('save') }}
                    <ChevronRightIcon width="20" height="20" />
                </Button>
            </div>
        </form>
    </Popup>
</template>
