<script setup lang="ts">
import type { Link } from '@/types'
import { useGroupStore } from '@/stores/group'
import { error } from '@common/modules/error'
import { restoreTabs } from '@/modules/tabs/restoreTabs'
import DeleteLinkButton from '@/components/Views/GroupView/DeleteLinkButton.vue'
import LinkElement from '@/components/LinkElement.vue'

const props = defineProps<{
    link: Link
    groupId: number
}>()

const groupStore = useGroupStore()

async function openTab(): Promise<void> {
    if (groupStore.selectedGroup) {
        await groupStore.saveGroup(groupStore.selectedGroup)
    } else {
        error.err(`Group with id ${props.groupId} is not selected as selectedGroup`)
    }

    await restoreTabs([props.link])
}
</script>

<template>
    <LinkElement @click="openTab" :link>
        <DeleteLinkButton @click.stop :linkId="link.id" :groupId />
    </LinkElement>
</template>
