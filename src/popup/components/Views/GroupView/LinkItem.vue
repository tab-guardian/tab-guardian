<script setup lang="ts">
import type { Link } from '@/types'
import restoreTabs from '@/modules/tabs/restoreTabs'
import DeleteLinkButton from '@/components/Views/GroupView/DeleteLinkButton.vue'
import LinkElement from '@/components/LinkElement.vue'

const props = defineProps<{
    link: Link
    groupId: number
}>()

async function openTab(): Promise<void> {
    await restoreTabs([props.link])
}
</script>

<template>
    <LinkElement @click="openTab" :link>
        <DeleteLinkButton @click.stop :linkId="link.id" :groupId />
    </LinkElement>
</template>
