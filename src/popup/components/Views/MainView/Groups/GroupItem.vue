<script setup lang="ts">
import type { Group } from '@/types'
import { computed } from 'vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import ShieldExclamationIcon from '@common/components/Icons/ShieldExclamationIcon.vue'
import OpenTabsButton from '@/components/Views/MainView/Groups/OpenTabsButton.vue'

type Props = {
    group: Group
}

const { group } = defineProps<Props>()

const groupClasses = computed(() => {
    const commonClasses = [
        'p-2',
        'flex',
        'justify-between',
        'items-center',
        'gap-3',
        'transition-colors',
        'border-b',
        'border-border',
        'bg-page hover:bg-page-hover',
    ]

    const privateGroup = group.isPrivate ? '!bg-safe hover:!bg-safe-hover' : ''

    const unsafeGroup =
        group.isPrivate && !group.isEncrypted
            ? '!bg-unsafe hover:!bg-unsafe-hover'
            : ''

    return [privateGroup, unsafeGroup, ...commonClasses]
})
</script>

<template>
    <RouterLink
        :to="{ name: 'group', params: { id: group.id } }"
        :class="groupClasses"
        class="group"
    >
        <div class="flex items-center gap-2">
            <div v-if="group.isPrivate">
                <ShieldCheckIcon
                    v-if="group.isEncrypted"
                    class="w-6 h-6 text-private"
                />

                <ShieldExclamationIcon v-else class="w-6 h-6 text-red-400" />
            </div>

            <div
                v-else
                class="flex items-center justify-center w-6 h-6 text-primary text-sm"
            >
                {{ group.links.length }}
            </div>

            <h2 class="text-sm">{{ group.name }}</h2>
        </div>

        <div class="flex items-center gap-3">
            <OpenTabsButton v-if="!group.isEncrypted" :group />
            <ChevronRightIcon class="w-4 h-4" />
        </div>
    </RouterLink>
</template>
