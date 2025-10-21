<script setup lang="ts">
import type { Group } from '@common/types'
import { ref, reactive, computed, onMounted } from 'vue'
import { trans } from '@common/modules'
import { showToast } from '@common/modules/toast'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import { useAttemptsStore } from '@/stores/attempts'
import { useCryptoStore } from '@/stores/crypto'
import { getDecryptionError } from '@/errors'
import { cloneDeep } from 'lodash'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import NameInput from '@common/components/Form/NameInput.vue'
import PasswordInput from '@common/components/Form/PasswordInput.vue'
import Progress from '@common/components/Progress.vue'

const popupStore = usePopupStore()
const groupStore = useGroupStore()
const attemptsStore = useAttemptsStore()
const cryptoStore = useCryptoStore()

const processing = ref<boolean>(false)
const formData = reactive({ name: '', pass: '' })
const errors = reactive({ name: false, pass: false })

const preventSubmit = computed<boolean>(() => {
    return errors.pass || errors.name
})

onMounted(async () => await groupStore.loadGroupsFromStorage())

async function submit(): Promise<void> {
    if (processing.value || preventSubmit.value) {
        return
    }

    const attempt = await attemptsStore.makeAttempt()

    if (!attempt.success) {
        showToast({ text: attempt.error, type: 'error', duration: 5000 })
        hidePopup()
        return
    }

    processing.value = true

    const group = groupStore.getGroup(formData.name)

    if (!group) {
        showToast({ text: trans('group_not_found'), type: 'error' })
        hidePopup()
        return
    }

    try {
        await removeBindUrl(group)
        await attemptsStore.unlock()
    } catch (err: any) {
        showToast({
            text: getDecryptionError(err),
            type: 'error',
            duration: 5000,
        })
    }

    if (attemptsStore.isLocked) {
        showToast({
            text: attemptsStore.isLockedErrorMessage(),
            type: 'error',
            duration: 5000,
        })
    }

    showToast({ text: trans('bind_url_removed') })
    hidePopup()
}

async function removeBindUrl(g: Group): Promise<void> {
    let group = cloneDeep(g)

    if (group.isEncrypted) {
        // We decrypt just to make sure that provided password is correct
        group = await cryptoStore.decryptGroup(group, formData.pass)
    }

    delete group.bindUrl
    const encrypted = await cryptoStore.encryptGroup(group, formData.pass)
    await groupStore.save(encrypted)
}

function hidePopup(): void {
    formData.pass = ''
    formData.name = ''
    processing.value = false

    popupStore.hide('removeUrlLock', {})
}
</script>

<template>
    <Popup
        @cancel="popupStore.hide('removeUrlLock', {})"
        :content="trans('enter_credentials')"
    >
        <form @submit.prevent="submit" class="space-y-3">
            <NameInput
                v-model:name="formData.name"
                :loading="processing"
                @loaded="inp => inp.focus()"
                @has-error="errors.name = $event"
            />

            <PasswordInput
                v-model="formData.pass"
                id="enter-password"
                :label="trans('enter_pass')"
                :loading="processing"
                @has-error="errors.pass = $event"
            />

            <Progress v-if="processing" />

            <div class="flex justify-end">
                <Button
                    type="submit"
                    :disabled="preventSubmit"
                    :loading="processing"
                    :icon="ChevronRightIcon"
                >
                    {{ trans('confirm') }}
                </Button>
            </div>
        </form>
    </Popup>
</template>
