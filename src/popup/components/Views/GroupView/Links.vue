<script setup lang="ts">
import type { Group } from '@/types'
import { useTransStore } from '@/stores/trans'
import LinkItem from '@/components/Views/GroupView/LinkItem.vue'
import Message from '@common/components/Message.vue'

type Props = {
    group: Group
}

const { group } = defineProps<Props>()
const { trans } = useTransStore()
</script>

<template>
    <Message v-if="group.links.length === 0">
        {{ trans('There are no links in this group') }}
    </Message>

    <div v-else class="flex flex-col gap-1.5">
        <LinkItem
            v-for="link in group.links"
            :key="link.id"
            :link="link"
            :groupId="group.id"
        />
    </div>
</template>
