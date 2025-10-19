<script setup lang="ts">
import type { Group } from '@common/types'
import { trans } from '@common/modules'
import { useGroupStore } from '@/stores/group'
import { VueDraggableNext } from 'vue-draggable-next'
import LinkItem from '@/components/Views/GroupView/LinkItem.vue'
import Message from '@common/components/Message.vue'

type Props = {
    group: Group
}

const { group } = defineProps<Props>()
const groupStore = useGroupStore()
</script>

<template>
    <Message v-if="group.links.length === 0">
        {{ trans('no_tabs_this_group') }}
    </Message>

    <div v-else>
        <VueDraggableNext
            v-model="group.links"
            class="space-y-2"
            @change="groupStore.save(group)"
        >
            <LinkItem
                v-for="link in group.links"
                :key="link.id"
                :link="link"
                :group-id="group.id"
            />
        </VueDraggableNext>
    </div>
</template>
