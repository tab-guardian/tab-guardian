<script setup lang="ts">
import type { Group } from '@/types'
import { CRYPTO_JS_DECRYPTION_FAILED, WEB_CRYPTO_DECRYPTION_FAILED } from '@/errors'
import { ref } from 'vue'
import { trans } from '@common/modules/trans'
import { useGroupStore } from '@/stores/group'
import { useTabsStore } from '@/stores/tabs'
import { useAttemptsStore } from '@/stores/attempts'
import { useRoute, useRouter } from 'vue-router'
import { error } from '@common/modules/error'
import { showToast } from '@common/modules/showToast'
import { savePasswordToStorage } from '@common/modules/storage/savePasswordToStorage'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import Input from '@common/components/Form/Input.vue'

type Props = {
    group: Group
}

const props = defineProps<Props>()

const { params } = useRoute()
const router = useRouter()
const groupStore = useGroupStore()
const tabsStore = useTabsStore()
const { lockedMessageToast, hasMaxAttempts, isAllowedToTry, resetAttempts } = useAttemptsStore()

const password = ref<string>('')

async function submitPass(): Promise<void> {
    if (!password.value) {
        showToast(trans('enter_pass'), 'error')
        return
    }

    if (!isAllowedToTry()) {
        password.value = ''
        return
    }

    // With this, we don't need to type password to lock the
    // group after just unlocking it
    savePasswordToStorage(props.group.id, password.value)

    try {
        await groupStore.decryptGroup(props.group, password.value)
        resetAttempts()

        params.openTabs === 'true'
            ? openTabsAndEncryptGroup()
            : showToast(trans('group_unlocked'))
    } catch (e: any) {
        const wrongPass = e instanceof Error &&
            [CRYPTO_JS_DECRYPTION_FAILED, WEB_CRYPTO_DECRYPTION_FAILED]
                .includes(e.message)

        if (!wrongPass) {
            error.err('Caught and handled error: ', e)
        }

        if (wrongPass) {
            showToast(trans('wrong_pass'), 'error')

            if (hasMaxAttempts()) {
                lockedMessageToast()
            }
        } else {
            showToast(trans('error_occurred'), 'error')
        }
    }

    password.value = ''
}

async function openTabsAndEncryptGroup(): Promise<void> {
    await tabsStore.openTabs(props.group, password.value)

    router.push({ name: 'main' })
}
</script>

<template>
    <div class="px-2 mt-3">
        <p class="flex items-center gap-3 mb-2 text-sm leading-4">
            <ShieldCheckIcon width="45" height="45" />
            {{ trans('enter_pass_unlock_content') }}
        </p>

        <form @submit.prevent="submitPass">
            <Input
                @loaded="inp => inp.focus()"
                v-model="password"
                :label="trans('enter_pass')"
                type="password"
                id="enter-password"
                :withButton="true"
            />
        </form>
    </div>
</template>
