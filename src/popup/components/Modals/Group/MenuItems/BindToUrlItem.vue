<script setup lang="ts">
import type { Group } from '@common/types'
import MenuItem from '@/components/MenuItem.vue'
import LinkIcon from '@common/components/Icons/LinkIcon.vue'
import { logger, trans } from '@common/modules'
import { useModalStore } from '@/stores/modal'
import { useGroupStore } from '@/stores/group'
import { useRouter } from 'vue-router'
import { showToast } from '@common/modules/toast'

const props = defineProps<{ group: Group }>()

const router = useRouter()
const modalStore = useModalStore()
const groupStore = useGroupStore()

async function rebind(): Promise<void> {
    if (!groupStore.selectedGroup) {
        showToast({
            text: trans('error_no_group_selected'),
            type: 'error',
        })
        return
    }

    modalStore.hide('groupMenu', {})

    const resp = await modalStore.show('bindGroup', {})

    if (!resp || !resp.url) {
        logger().info('Bind URL was canceled')
        return
    }

    groupStore.selectedGroup.bindUrl = resp.url
    groupStore.save(groupStore.selectedGroup)

    showToast({ text: trans('group_rebind_successful') })

    await router.push({
        name: 'group',
        params: { id: groupStore.selectedGroup.id },
    })
}
</script>

<template>
    <MenuItem
        @click="rebind"
        :label="group.bindUrl ? trans('rebind_to_other_url') : trans('bind_to_url')"
        :icon="LinkIcon"
    />
</template>
