<script setup lang="ts">
import type { Group } from '@/types'
import { CRYPTO_JS_DECRYPTION_FAILED, WEB_CRYPTO_DECRYPTION_FAILED } from '@/errors'
import { ref } from 'vue'
import { trans } from '@common/modules/trans'
import { useGroupStore } from '@/stores/group'
import { useTabsStore } from '@/stores/tabs'
import { useAttemptsStore } from '@/stores/attempts'
import { useCryptoStore } from '@/stores/crypto'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from '@common/modules/showToast'
import { savePasswordToStorage } from '@common/modules/storage/password'
import { useNotificationStore } from '@/stores/notification'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import WarningBox from '@common/components/WarningBox.vue'
import ProgressBar from '@common/components/ProgressBar.vue'
import PasswordInput from '@common/components/Form/PasswordInput.vue'

type Props = {
    group: Group
}

const props = defineProps<Props>()

const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()
const notificationStore = useNotificationStore()
const tabsStore = useTabsStore()
const cryptoStore = useCryptoStore()
const { lockedMessageToast, hasMaxAttempts, isAllowedToTry, resetAttempts } = useAttemptsStore()

const password = ref<string>('')
const decrypting = ref<boolean>(false)

async function submitPass(): Promise<void> {
    if (decrypting.value) {
        return
    }

    if (!password.value) {
        showToast(trans('enter_pass'), 'error')
        return
    }

    if (!isAllowedToTry()) {
        password.value = ''
        return
    }

    try {
        await unlockGroup()
    } catch (err: any) {
        handleUnlockGroupError(err)
    }

    decrypting.value = false
    password.value = ''
}

async function unlockGroup(): Promise<void> {
    decrypting.value = true

    const decryptedGroup = await cryptoStore.decryptGroup(props.group, password.value)
    await groupStore.save(decryptedGroup)

    resetAttempts()

    await notificationStore.recalculateNotification()

    // With this, we don't need to type password to lock the
    // group after just unlocking it
    await savePasswordToStorage(props.group.id, password.value)

    route.params.openTabs === 'true'
        ? openTabsAndEncryptGroup()
        : showToast(trans('group_unlocked'))
}

function handleUnlockGroupError(err: any): void {
    const wrongPass = err instanceof Error &&
        [CRYPTO_JS_DECRYPTION_FAILED, WEB_CRYPTO_DECRYPTION_FAILED]
            .includes(err.message)

    if (!wrongPass) {
        console.error('Caught and handled error: ', err)
        showToast(trans('error_occurred'), 'error')
        return
    }

    showToast(trans('wrong_pass'), 'error')

    if (hasMaxAttempts()) {
        lockedMessageToast()
    }
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
            <PasswordInput
                @loaded="inp => inp.focus()"
                v-model="password"
                id="enter-password"
                :label="trans('enter_pass')"
                :with-button="true"
                :loading="decrypting"
            />
        </form>

        <ProgressBar
            v-if="decrypting"
            :current="cryptoStore.progress.current"
            :max="cryptoStore.progress.max"
            class="mt-3"
        />

        <WarningBox
            v-if="!group.algo"
            class="mt-4"
            :message="trans('uses_old_encrypt_impl')"
        />
    </div>
</template>
