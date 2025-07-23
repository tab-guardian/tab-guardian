<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules/trans'
import PencilSquareIcon from '@common/components/Icons/PencilSquareIcon.vue'
import MenuItem from '@/components/MenuItem.vue'

const store = useGroupStore()
</script>

<template>
    <MenuItem
        @click="store.startGroupRenaming"
        :label="trans('rename_this_group')"
        :icon="PencilSquareIcon"
    />
</template>
