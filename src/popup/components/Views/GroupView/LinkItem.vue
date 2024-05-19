<script setup lang="ts">
import type { Link } from '@/types'
import DeleteLinkButton from '@/components/Views/GroupView/DeleteLinkButton.vue'
import LinkElement from '@/components/LinkElement.vue'

type Props = {
    link: Link
    groupId: number
}

const props = defineProps<Props>()
</script>

<template>
    <LinkElement
        :isLink="true"
        :link="props.link"
        target="_blank"
        rel="noopener noreferrer"
    >
        <DeleteLinkButton :linkId="link.id" :groupId />
    </LinkElement>
</template>
