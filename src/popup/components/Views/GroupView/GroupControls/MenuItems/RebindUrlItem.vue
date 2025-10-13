<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue'
import LinkIcon from '@common/components/Icons/LinkIcon.vue'
import { trans } from '@common/modules/utils'
import { usePopupStore } from '@/stores/popup'

const { closePopup, openPopup } = usePopupStore()

function rebind(): void {
    closePopup('groupMenuView', {})
    openPopup('rebindGroup', {})
}
</script>

<template>
    <MenuItem
        @click="rebind"
        :label="trans('rebind_to_other_url')"
        :icon="LinkIcon"
    />
</template>
