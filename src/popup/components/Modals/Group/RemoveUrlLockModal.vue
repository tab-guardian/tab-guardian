<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { trans } from '@common/modules'
import { showToast } from '@common/modules/toast'
import { useModalStore } from '@/stores/modal'
import { useGroupStore } from '@/stores/group'
import { useAttemptsStore } from '@/stores/attempts'
import Modal from '@/components/Modals/Modal.vue'
import Button from '@common/components/Form/Button.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import TextInput from '@common/components/Form/TextInput.vue'
import PasswordInput from '@common/components/Form/PasswordInput.vue'
import Progress from '@common/components/Progress.vue'

const modalStore = useModalStore()
const groupStore = useGroupStore()
const attemptsStore = useAttemptsStore()

const processing = ref<boolean>(false)
const formData = reactive({ name: '', pass: '' })
const errors = reactive({ name: false, pass: false })

const preventSubmit = computed<boolean>(() => {
    return errors.pass || errors.name
})

onMounted(async () => await groupStore.load())

async function submit(): Promise<void> {
    if (processing.value || preventSubmit.value) {
        return
    }

    processing.value = true

    const attempt = await attemptsStore.makeAttempt()

    if (!attempt.success) {
        fail(attempt.error)
        return
    }

    const result = await groupStore.removeBindUrl(formData.name, formData.pass)

    if (result.failed) {
        fail(result.message)
        return
    }

    await attemptsStore.unlock()

    if (attemptsStore.isLocked) {
        fail(trans('group_with_credentials_not_found'))
        return
    }

    showToast({ text: result.message })
    clearForm()

    modalStore.hide('removeUrlLock', {})
}

function fail(text: string): void {
    showToast({ text, type: 'error' })
    clearForm()
}

function clearForm(): void {
    formData.pass = ''
    formData.name = ''
    processing.value = false
}
</script>

<template>
    <Modal
        @cancel="modalStore.hide('removeUrlLock', {})"
        :title="trans('enter_credentials')"
    >
        <form @submit.prevent="submit" class="flex flex-col gap-3">
            <TextInput
                v-model:text="formData.name"
                :label="trans('group_name')"
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
    </Modal>
</template>
