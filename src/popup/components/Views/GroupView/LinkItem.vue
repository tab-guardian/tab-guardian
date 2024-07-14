<script setup lang="ts">
import type { Link } from '@/types'
import DeleteLinkButton from '@/components/Views/GroupView/DeleteLinkButton.vue'
import LinkElement from '@/components/LinkElement.vue'

defineProps<{
    link: Link
    groupId: number
}>()
</script>

<template>
    <LinkElement :link target="_blank" rel="noopener noreferrer">
        <DeleteLinkButton :linkId="link.id" :groupId />
    </LinkElement>
</template>
