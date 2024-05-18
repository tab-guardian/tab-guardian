<script setup lang="ts">
import type { Group } from '@/types'
import { useTransStore } from '@/stores/trans'
import { useGroupStore } from '@/stores/group'
import showToast from '@common/modules/showToast'
import ShieldExclamationIcon from '@common/components/Icons/ShieldExclamationIcon.vue'

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
        class="flex items-center justify-between mb-4 bg-secondary p-3 rounded-lg gap-4"
    >
        <ShieldExclamationIcon class="w-8 h-8 text-red-400" />

        <span class="text-sm">
            {{ trans('This private group is unlocked') }}
        </span>

        <button
            @click="lockGroup"
            :class="[
                'bg-green-300 dark:bg-green-800 px-3 py-2 rounded-md',
                'text-sm hover:bg-black/50 text-bg font-semibold',
            ]"
        >
            {{ trans('Lock') }}
        </button>
    </div>
</template>
