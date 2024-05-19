<script setup lang="ts">
import type { Group } from '@/types'
import { useTransStore } from '@/stores/trans'
import { useGroupStore } from '@/stores/group'
import showToast from '@common/modules/showToast'
import ShieldExclamationIcon from '@common/components/Icons/ShieldExclamationIcon.vue'
import LockClosedIcon from '@common/components/Icons/LockClosedIcon.vue'

type Props = {
    group: Group
}

const { group } = defineProps<Props>()
const { trans } = useTransStore()
const groupStore = useGroupStore()

function lockGroup(): void {
    const completed = groupStore.encryptGroupById(group.id)

    if (completed) {
        showToast(trans('Group is locked'))
    }
}
</script>

<template>
    <div
        class="flex items-center justify-between mb-4 bg-unsafe p-3 rounded-lg gap-4"
    >
        <ShieldExclamationIcon class="w-8 h-8 text-red-400" />

        <span class="text-sm">
            {{ trans('This private group is unlocked') }}
        </span>

        <button
            @click="lockGroup"
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
