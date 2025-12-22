<script setup lang="ts">
import type { Group } from '@common/types'
import { usePopupStore } from '@/stores/popup'
import { getDefaultName, trans } from '@common/modules'
import { showToast } from '@common/modules/toast'
import { useGroupStore } from '@/stores/group'
import PencilSquareIcon from '@common/components/Icons/PencilSquareIcon.vue'
import MenuItem from '@/components/MenuItem.vue'

const popupStore = usePopupStore()
const groupStore = useGroupStore()

const props = defineProps<{ group: Group }>()

async function startRenaming(): Promise<void> {
    popupStore.hide('groupMenu', {})

    const resp = await popupStore.show('textInput', {
        text: props.group.name,
        label: trans('group_name'),
        title: trans('enter_group_name'),
        submitText: trans('save'),
    })

    if (!resp || resp.canceled) {
        return
    }

    const name = resp.name ?? getDefaultName('Group')

    await groupStore.update(props.group.id, { name })

    showToast({ text: trans('new_name_saved') })
}
</script>

<template>
    <MenuItem
        @click="startRenaming"
        :label="trans('rename')"
        :icon="PencilSquareIcon"
    />
</template>
