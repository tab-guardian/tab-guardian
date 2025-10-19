<script setup lang="ts">
import type { Group } from '@common/types'
import { cloneDeep } from 'lodash'
import { trans } from '@common/modules'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import { showToast } from '@common/modules/toast'
import MenuItem from '@/components/MenuItem.vue'
import LockOpenIcon from '@common/components/Icons/LockOpenIcon.vue'

const props = defineProps<{ group: Group }>()

const groupStore = useGroupStore()
const popupStore = usePopupStore()

async function promptToMakeOpen(): Promise<void> {
    popupStore.hide('groupMenuView', {})

    const resp = await popupStore.show('confirm', {
        text: trans('are_you_sure_to_make_group_open'),
    })

    if (resp && resp.isConfirmed) {
        await makeOpen()
    }
}

async function makeOpen(): Promise<void> {
    const group = cloneDeep(props.group)

    group.isPrivate = false
    delete group.algo
    delete group.bindURL
    delete group.hide

    for (const link of group.links) {
        delete link.iv
        delete link.salt
    }

    await groupStore.save(group)

    showToast(trans('group_is_now_open'))
}
</script>

<template>
    <MenuItem
        :label="trans('make_group_open')"
        :icon="LockOpenIcon"
        @click="promptToMakeOpen"
    />
</template>
