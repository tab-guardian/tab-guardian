<script setup lang="ts">
import type { Group } from '@/types'
import { ref } from 'vue'
import { useTransStore } from '@/stores/useTransStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useGroupStore } from '@/stores/useGroupStore'
import ShieldCheckIcon from '@/components/Icons/ShieldCheckIcon.vue'
import InputField from '@/components/Form/InputField.vue'

type Props = {
    group: Group
}

const props = defineProps<Props>()
const { trans } = useTransStore()
const settingsStore = useSettingsStore()
const { decryptGroup } = useGroupStore()

const password = ref<string>('')

function submitPass(): void {
    if (!password.value) {
        // @todo: show error message like a toast or something
        return
    }

    if (settingsStore.passwordMatches(password.value)) {
        decryptGroup(props.group, settingsStore.settings.password)
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
            <!-- prettier-ignore -->
            {{ trans('Enter a password to temporarily decrypt the content of this group') }}
        </p>

        <InputField
            @submit="submitPass"
            @loaded="inp => inp.focus()"
            v-model="password"
            :placeholder="trans('Enter a password')"
            type="password"
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
