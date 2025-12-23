<script setup lang="ts">
import type { Link } from '@common/types'
import { useGroupStore } from '@/stores/group'
import { restoreTabs } from '@common/modules/tabs/restoreTabs'
import { useModalStore } from '@/stores/modal'
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
const modalStore = useModalStore()

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

async function showTabLinkModal(): Promise<void> {
    await modalStore.show('linkMenu', { link: props.link })
}
</script>

<template>
    <LinkElement
        @click="openTab"
        @click.prevent.right="showTabLinkModal"
        :class-name="linkStore.isCut(link.id) ? 'opacity-50' : ''"
        :link
    >
        <DeleteLinkButton @click.stop :linkId="link.id" :groupId />
    </LinkElement>
</template>
