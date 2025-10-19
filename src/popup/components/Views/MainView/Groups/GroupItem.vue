<script setup lang="ts">
import type { Group } from '@common/types'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { useGroupUnlock } from '@/composables/useGroupUnlock'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import OpenTabsButton from '@/components/Views/MainView/Groups/OpenTabsButton.vue'
import GroupIcon from '@/components/Views/MainView/Groups/GroupIcon.vue'

const props = defineProps<{ group: Group }>()

const router = useRouter()
const popupStore = usePopupStore()
const { unlockGroup } = useGroupUnlock()

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
        await popupStore.show('enterPassword', {
            decrypting: async pass => await unlockGroup(props.group, pass),
            text: trans('enter_pass_unlock_content'),
        })

        return
    }

    await router.push({ name: 'group', params: { id: props.group.id } })
}
</script>

<template>
    <div @click="navigateToGroupView" :class="groupClasses">
        <div class="flex items-center gap-2">
            <GroupIcon :group />
            <h2 class="text-sm">{{ group.name }}</h2>
        </div>

        <div class="flex items-center gap-3">
            <OpenTabsButton :group />
            <ChevronRightIcon class="size-4" />
        </div>
    </div>
</template>
