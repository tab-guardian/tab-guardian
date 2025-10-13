<script setup lang="ts">
import type { Group } from '@common/types'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePopupStore } from '@/stores/popup'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import ShieldExclamationIcon from '@common/components/Icons/ShieldExclamationIcon.vue'
import OpenTabsButton from '@/components/Views/MainView/Groups/OpenTabsButton.vue'
import GroupIcon from '@/components/Views/MainView/Groups/GroupIcon.vue'

const props = defineProps<{ group: Group }>()

const { openPopup, setSharedData } = usePopupStore()
const router = useRouter()

const groupClasses = computed(() => {
    const commonClasses = [
        'p-2 flex justify-between items-center gap-3',
        'transition-colors border-b border-border',
        'cursor-pointer bg-page hover:bg-page-hover',
    ]

    const privateGroup = props.group.isPrivate ? '!bg-safe hover:!bg-safe-hover' : ''

    const unsafeGroup =
        props.group.isPrivate && !props.group.isEncrypted
            ? '!bg-unsafe hover:!bg-unsafe-hover'
            : ''

    return [privateGroup, unsafeGroup, ...commonClasses]
})

async function navigateToGroupView(): Promise<void> {
    if (props.group.isPrivate && props.group.isEncrypted) {
        openPopup('enterPassword')
        setSharedData('enterPassword', props.group)
        return
    }

    await router.push({ name: 'group', params: { id: props.group.id } })
}
</script>

<template>
    <div @click="navigateToGroupView" :class="groupClasses">
        <div class="flex items-center gap-2">
            <div v-if="group.isPrivate" class="w-6 h-6">
                <ShieldCheckIcon
                    v-if="group.isEncrypted"
                    class="w-6 h-6 text-private"
                    :class="{ 'text-red-400': !group.algo }"
                />

                <ShieldExclamationIcon v-else class="w-6 h-6 text-red-400" />
            </div>

            <GroupIcon v-else-if="group.icon" :group />

            <div
                v-else
                class="flex items-center justify-center w-6 h-6 text-primary text-sm"
            >
                {{ group.links.length }}
            </div>

            <h2 class="text-sm">{{ group.name }}</h2>
        </div>

        <div class="flex items-center gap-3">
            <OpenTabsButton :group />
            <ChevronRightIcon class="w-4 h-4" />
        </div>
    </div>
</template>
