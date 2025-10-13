<script setup lang="ts">
import type { Link } from '@common/types'
import { useGroupStore } from '@/stores/group'
import { restoreTabs } from '@common/modules/tabs/restoreTabs'
import { usePopupStore } from '@/stores/popup'
import { useAppStore } from '@/stores/app'
import DeleteLinkButton from '@/components/Views/GroupView/DeleteLinkButton.vue'
import LinkElement from '@/components/LinkElement.vue'

const props = defineProps<{
    link: Link
    groupId: number
}>()

const { linkIsCut } = useAppStore()
const groupStore = useGroupStore()
const { openPopup, setSharedData } = usePopupStore()

async function openTab(): Promise<void> {
    if (groupStore.selectedGroup) {
        await groupStore.saveGroup(groupStore.selectedGroup)
    } else {
        console.error(
            `Group with id ${props.groupId} is not selected as selectedGroup`,
        )
    }

    await restoreTabs([props.link])
}

async function openTabLinkPopup(): Promise<void> {
    openPopup('linkMenuView')
    setSharedData('linkMenuView', props.link)
}
</script>

<template>
    <LinkElement
        @click="openTab"
        @click.prevent.right="openTabLinkPopup"
        :class-name="linkIsCut(link.id) ? 'opacity-50' : ''"
        :link
    >
        <DeleteLinkButton @click.stop :linkId="link.id" :groupId />
    </LinkElement>
</template>
