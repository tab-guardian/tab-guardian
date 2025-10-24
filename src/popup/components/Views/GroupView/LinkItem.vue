<script setup lang="ts">
import type { Link } from '@common/types'
import { useGroupStore } from '@/stores/group'
import { restoreTabs } from '@common/modules/tabs/restoreTabs'
import { usePopupStore } from '@/stores/popup'
import { useLinkStore } from '@/stores/link'
import { logger } from '@common/modules'
import DeleteLinkButton from '@/components/Views/GroupView/DeleteLinkButton.vue'
import LinkElement from '@/components/LinkElement.vue'

const props = defineProps<{
    link: Link
    groupId: number
}>()

const linkStore = useLinkStore()
const groupStore = useGroupStore()
const popupStore = usePopupStore()

async function openTab(): Promise<void> {
    if (groupStore.selectedGroup) {
        await groupStore.save(groupStore.selectedGroup)
    } else {
        logger().error(
            `Group with id ${props.groupId} is not selected as selectedGroup`,
        )
    }

    await restoreTabs([props.link])
}

async function showTabLinkPopup(): Promise<void> {
    await popupStore.show('linkMenuView', { link: props.link })
}
</script>

<template>
    <LinkElement
        @click="openTab"
        @click.prevent.right="showTabLinkPopup"
        :class-name="linkStore.isLinkCut(link.id) ? 'opacity-50' : ''"
        :link
    >
        <DeleteLinkButton @click.stop :linkId="link.id" :groupId />
    </LinkElement>
</template>
