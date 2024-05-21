<script setup lang="ts">
import { ref } from 'vue'
import { useTransStore } from '@settings/stores/trans'
import { useMainStore } from '@settings/stores/main'
import showToast from '@common/modules/showToast'
import Section from '@settings/components/Section.vue'
import Button from '@settings/components/Form/Button.vue'
import Input from '@settings/components/Form/Input.vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

const { trans } = useTransStore()
const store = useMainStore()
const password = ref<string>('')
const newPassword = ref<string>('')

function submitPass(): void {
    if (password.value === '') {
        showToast(trans('Password cannot be empty'), 'error')
        return
    }

    store.updatePassword(password.value)
    password.value = ''
    showToast(trans('Password has been set'))
}

function changePass(): void {
    if (password.value === '' || newPassword.value === '') {
        showToast(trans('Password cannot be empty'), 'error')
        return
    }

    const changed = store.changePassword(password.value, newPassword.value)

    if (!changed) {
        showToast(trans('You entered the wrong password'), 'error')
        return
    }

    password.value = ''
    newPassword.value = ''

    showToast(trans('Password changed successfully'))
}
</script>

<template>
    <div>
        <Section
            v-if="store.settings.password === ''"
            :title="trans('Private Password')"
            :subtitle="
                trans(
                    'Choose a secret password for your private groups. Any time when you want to access a private group, you will need to enter this password',
                )
            "
        >
            <form @submit.prevent="submitPass" class="form">
                <div class="field">
                    <Input
                        id="password"
                        type="password"
                        :label="trans('Enter password')"
                        v-model="password"
                    />
                </div>

                <Button class="mt-3">
                    <CheckIcon class="w-5 h-5" />
                    {{ trans('Save password') }}
                </Button>
            </form>
        </Section>

        <Section v-else :title="trans('Change Password')">
            <form @submit.prevent="changePass" class="flex flex-col gap-3">
                <div>
                    <Input
                        id="old-pass"
                        v-model="password"
                        type="password"
                        :label="trans('Enter your current password')"
                    />
                </div>

                <div>
                    <Input
                        id="new-pass"
                        type="password"
                        v-model="newPassword"
                        :label="trans('Enter a new password')"
                    />
                </div>

                <Button>
                    <CheckIcon class="w-5 h-5" />
                    {{ trans('Update password') }}
                </Button>
            </form>
        </Section>
    </div>
</template>
