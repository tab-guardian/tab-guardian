<script setup lang="ts">
import type { Group } from '@/types'
import LinkItem from '@/components/Views/GroupView/LinkItem.vue'
import { useTransStore } from '@/stores/useTransStore'

type Props = {
    group: Group
}

const props = defineProps<Props>()
const { trans } = useTransStore()
</script>

<template>
    <p v-if="props.group.links.length === 0" class="message">
        {{ trans('There are no links in this group') }}
    </p>

    <div v-else class="group__links">
        <LinkItem
            v-for="link in group.links"
            :key="link.id"
            :link="link"
            :groupId="group.id"
        />
    </div>
</template>

<style lang="sass" scoped>
.group__links
    list-style: none
    padding: 0
    margin: 0
    display: flex
    flex-direction: column
    gap: 5px
</style>
