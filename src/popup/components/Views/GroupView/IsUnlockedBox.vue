<script setup lang="ts">
import type { Group } from '@/types'
import { useTransStore } from '@/stores/trans'
import { useGroupStore } from '@/stores/group'
import showToast from '@common/modules/showToast'
import ShieldExclamationIcon from '@common/components/Icons/ShieldExclamationIcon.vue'
import LockClosedIcon from '@common/components/Icons/LockClosedIcon.vue'
import getPasswordFromStorage from '@common/modules/storage/getPasswordFromStorage'
import deletePasswordFromStorage from '@common/modules/storage/deletePasswordFromStorage'

type Props = {
    group: Group
}

const { group } = defineProps<Props>()
const { trans } = useTransStore()
const groupStore = useGroupStore()

async function promptEnterPassword(): Promise<void> {
    const pass = await getPasswordFromStorage(group.id)

    if (!pass) {
        showToast(trans('Something went wrong! Cannot remember your password'))
        return
    }

    await groupStore.encryptGroupById(group.id, pass)
    await deletePasswordFromStorage(group.id)

    showToast(trans('Group is locked'))
}
</script>

<template>
    <div
        class="flex items-center justify-between mb-4 mt-1 bg-unsafe p-3 rounded-lg gap-4"
    >
        <ShieldExclamationIcon class="w-8 h-8 text-red-400" />

        <span class="text-sm">
            {{ trans('This private group is unlocked') }}
        </span>

        <button
            @click="promptEnterPassword"
            :class="[
                'bg-unsafe px-3 py-2 rounded-md',
                'text-sm hover:bg-unsafe-hover text-bg font-semibold',
                'flex items-center gap-2',
            ]"
        >
            <LockClosedIcon width="18" height="18" />
            {{ trans('Lock') }}
        </button>
    </div>
</template>
