<script setup lang="ts">
import type { Group } from '@common/types'
import MenuItem from '@/components/MenuItem.vue'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import { trans } from '@common/modules'
import { config } from '@common/config'
import { useGroupStore } from '@/stores/group'
import { showToast } from '@common/modules/toast'

const props = defineProps<{ group: Group }>()

const groupStore = useGroupStore()

async function makeGroupPrivate(): Promise<void> {
    const group = structuredClone(props.group)
    group.isPrivate = true
    group.algo = config.CURR_ENCRYPT_ALGO

    await groupStore.save(group)
    showToast({ text: trans('group_is_now_private') })
}
</script>

<template>
    <MenuItem
        @click="makeGroupPrivate"
        :label="trans('make_private')"
        :icon="ShieldCheckIcon"
    />
</template>
