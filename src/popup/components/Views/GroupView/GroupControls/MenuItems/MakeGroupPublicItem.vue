<script setup lang="ts">
import type { Group } from '@common/types'
import { cloneDeep } from 'lodash'
import { trans } from '@common/modules/utils'
import { useGroupStore } from '@/stores/group'
import { showToast } from '@common/modules/toast'
import Swal from 'sweetalert2'
import MenuItem from '@/components/MenuItem.vue'
import LockOpenIcon from '@common/components/Icons/LockOpenIcon.vue'

const props = defineProps<{ group: Group }>()

const groupStore = useGroupStore()

async function makePublic(): Promise<void> {
    const answer = await Swal.fire({
        text: trans('are_you_sure_to_make_group_open'),
        showDenyButton: true,
        confirmButtonText: trans('yes'),
        denyButtonText: trans('no'),
    })

    if (!answer.isConfirmed) {
        return
    }

    const group = cloneDeep(props.group)

    group.isPrivate = false
    delete group.algo
    delete group.bindURL
    delete group.hide

    for (const link of group.links) {
        delete link.iv
        delete link.salt
    }

    groupStore.saveGroup(group)

    showToast(trans('group_is_now_open'))
}
</script>

<template>
    <MenuItem
        :label="trans('make_group_open')"
        :icon="LockOpenIcon"
        @click="makePublic"
    />
</template>
