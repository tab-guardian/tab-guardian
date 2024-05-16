<script setup lang="ts">
import { ref } from 'vue'
import { useTransStore } from '@settings/stores/trans'
import { useMainStore } from '@settings/stores/main'
import Section from '@settings/components/Section.vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'
import showToast from '@/modules/showToast'

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
    //
}
</script>

<template>
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
            <div class="form__inline">
                <input
                    class="input"
                    type="password"
                    :placeholder="trans('Enter password')"
                    v-model="password"
                />

                <button type="submit">
                    <CheckIcon width="20" height="20" />
                </button>
            </div>
        </form>
    </Section>

    <Section
        v-else
        :title="trans('Change Password')"
        :subtitle="trans('Enter the old and new password to change it')"
    >
        <form @submit="changePass" class="form">
            <div class="field">
                <label for="old-pass" class="label">
                    {{ trans('Enter your current password') }}
                </label>

                <input
                    id="old-pass"
                    v-model="password"
                    class="input"
                    type="password"
                    :placeholder="trans('Enter your current password')"
                />
            </div>

            <div class="field">
                <div id="new-pass" class="label">
                    {{ trans('Enter a new password') }}
                </div>

                <input
                    id="new-pass"
                    class="input"
                    type="password"
                    v-model="newPassword"
                    :placeholder="trans('Enter a new password')"
                />
            </div>
        </form>
    </Section>
</template>
