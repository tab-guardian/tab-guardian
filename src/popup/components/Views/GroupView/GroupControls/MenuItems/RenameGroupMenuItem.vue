<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import PencilSquareIcon from '@common/components/Icons/PencilSquareIcon.vue'
import MenuItem from '@/components/MenuItem.vue'

const store = useGroupStore()
const { trans } = useTransStore()
</script>

<template>
    <MenuItem
        @click="store.startGroupRenaming"
        :label="trans('Rename this group')"
        :icon="PencilSquareIcon"
    />
</template>
