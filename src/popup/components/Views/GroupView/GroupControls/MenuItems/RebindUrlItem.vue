<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue'
import LinkIcon from '@common/components/Icons/LinkIcon.vue'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'

const { trans } = useTransStore()
const { closePopup, openPopup } = usePopupStore()

function rebind(): void {
    closePopup('groupView')
    openPopup('rebindGroup')
}
</script>

<template>
    <MenuItem
        @click="rebind"
        :label="trans('Rebind to other URL')"
        :icon="LinkIcon"
    />
</template>
