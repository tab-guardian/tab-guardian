<script setup lang="ts">
import { ref } from 'vue'
import { useTransStore } from '@settings/stores/trans'
import { useGroupStore } from '@/stores/group'
import { useMainStore } from '@settings/stores/main'
import showToast from '@common/modules/showToast'
import Section from '@settings/components/Section.vue'
import Button from '@settings/components/Form/Button.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'
import TrashIcon from '@common/components/Icons/TrashIcon.vue'
import Input from '@settings/components/Form/Input.vue'

const { trans } = useTransStore()
const store = useMainStore()
const groupStore = useGroupStore()
const isConfirmed = ref<boolean>(false)
const showPasswordField = ref<boolean>(false)
const password = ref<string>('')

function saveSettings(): void {
    if (store.loading) {
        return
    }

    if (!isConfirmed.value) {
        showToast(trans('Confirm that you want to delete all groups'), 'error')
        return
    }

    if (password.value !== '') {
        if (store.passwordMatches(password.value)) {
            save()
            return
        }

        showToast(trans('Password is incorrect'), 'error')
        return
    }

    const hasPrivateGroup = groupStore.groups.some(g => g.isPrivate)

    if (hasPrivateGroup) {
        const message = trans(
            'You have private groups, please enter password to delete all groups',
        )
        showToast(message, 'error', 4000)
        showPasswordField.value = true
        return
    }

    save()
}

function save(): void {
    store.loading = true
    groupStore.deleteAllGroups()

    showToast(trans('All groups have been deleted'))

    isConfirmed.value = false
    store.loading = false
    password.value = ''
}
</script>

<template>
    <form @submit.prevent="saveSettings">
        <Section :title="trans('Erase all groups')">
            <div class="flex items-center justify-between gap-3">
                <SlideSwitch v-model="isConfirmed">
                    {{ trans('I confirm that I want to delete all groups') }}
                </SlideSwitch>

                <Button
                    additionalClasses="bg-red-600 dark:bg-red-400 min-w-[200px]"
                >
                    <TrashIcon class="w-5 h-5" />
                    {{ trans('Erase all groups') }}
                </Button>
            </div>

            <div v-if="showPasswordField" class="mt-4">
                <Input
                    id="enter-password"
                    type="password"
                    v-model="password"
                    class="max-w-[400px]"
                    :label="trans('Enter password to delete all groups')"
                    @loaded="inp => inp.focus()"
                />
            </div>
        </Section>
    </form>
</template>
