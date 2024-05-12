<script setup lang="ts">
import type { Group } from '@/types'
import { ref, watchEffect } from 'vue'
import { useTransStore } from '@/stores/useTransStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import ShieldCheckIcon from '@/components/Icons/ShieldCheckIcon.vue'
import InputField from '@/components/Form/InputField.vue'

type Props = {
    group: Group
}

const { group } = defineProps<Props>()
const { trans } = useTransStore()
const { passwordMatches } = useSettingsStore()

const inputRef = ref<HTMLInputElement | null>(null)
const password = ref<string>('')

watchEffect(() => {
    if (inputRef.value) {
        inputRef.value.focus()
    }
})

function submitPass(): void {
    if (!password.value) {
        // @todo: show error message like a toast or something
        return
    }

    if (passwordMatches(password.value)) {
        console.log('Password matches')
        // @todo: do something here
        password.value = ''
        return
    }

    console.log('Password does not match')
    // @todo: show error message that password is incorrect
}
</script>

<template>
    <div class="enter-pass">
        <p class="enter-pass__heading">
            <ShieldCheckIcon width="40" height="40" />
            {{ trans('Enter a password to decrypt the content of this group') }}
        </p>

        <InputField
            @submit="submitPass"
            :placeholder="trans('Enter a password')"
            v-model="password"
        />
    </div>
</template>

<style lang="sass" scoped>
.enter-pass
    background-color: var(--tg-color-bg)
    padding: 12px
    border-radius: 7px
    box-shadow: 4px 4px 7px rgba(0, 0, 0, .1)
    margin-top: 10px

    &__heading
        font-size: .9rem
        display: flex
        align-items: center
        gap: 10px
        margin: 0 0 7px 0
</style>
