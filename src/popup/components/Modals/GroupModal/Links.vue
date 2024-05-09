<script setup lang="ts">
import type { Group } from '@/types'
import LinkItem from '@/components/Modals/GroupModal/LinkItem.vue'
import { useTransStore } from '@/stores/useTransStore'

type Props = {
    group: Group
}

const props = defineProps<Props>()
const { trans } = useTransStore()
</script>

<template>
    <p
        v-if="props.group.links.length === 0"
        class="warn-message"
    >
        {{ trans('There are no links in this group') }}
    </p>

    <ul v-else class="group__links">
        <LinkItem
            v-for="link in group.links"
            :key="link.id"
            :link="link"
            :groupId="group.id"
        />
    </ul>
</template>