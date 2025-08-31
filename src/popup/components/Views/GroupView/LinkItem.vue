<script setup lang="ts">
import type { Link } from '@/types'
import { useGroupStore } from '@/stores/group'
import { error } from '@common/modules/error'
import { restoreTabs } from '@/modules/tabs/restoreTabs'
import DeleteLinkButton from '@/components/Views/GroupView/DeleteLinkButton.vue'
import LinkElement from '@/components/LinkElement.vue'
import { usePopupStore } from '@/stores/popup'

const props = defineProps<{
    link: Link
    groupId: number
}>()

const groupStore = useGroupStore()
const { openPopup } = usePopupStore()

async function openTab(): Promise<void> {
    if (groupStore.selectedGroup) {
        await groupStore.saveGroup(groupStore.selectedGroup)
    } else {
        error.err(`Group with id ${props.groupId} is not selected as selectedGroup`)
    }

    await restoreTabs([props.link])
}

async function openTabLinkPopup(): Promise<void> {
    openPopup('tabLinkView', props.link)
}
</script>

<template>
    <LinkElement @click="openTab" @click.prevent.right="openTabLinkPopup" :link>
        <DeleteLinkButton @click.stop :linkId="link.id" :groupId />
    </LinkElement>
</template>
