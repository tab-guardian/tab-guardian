<script setup lang="ts">
import CloseIcon from '@common/components/Icons/CloseIcon.vue'
import { useGroupStore } from '@/stores/group'

type Props = {
    linkId: number
    groupId: number
}

const { linkId, groupId } = defineProps<Props>()

const groupStore = useGroupStore()
</script>

<template>
    <div
        @click.prevent="groupStore.deleteLink(groupId, linkId)"
        :class="[
            'flex items-center py-1 rounded-sm transition-all',
            'border border-transparent hover:border-border',
            'hover:bg-secondary',
        ]"
    >
        <CloseIcon width="15" height="15" />
    </div>
</template>
