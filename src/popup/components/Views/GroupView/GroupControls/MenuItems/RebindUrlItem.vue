<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue'
import LinkIcon from '@common/components/Icons/LinkIcon.vue'
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'

const popupStore = usePopupStore()

function rebind(): void {
    popupStore.hide('groupMenuView', {})
    popupStore.show('rebindGroup', {})
}
</script>

<template>
    <MenuItem
        @click="rebind"
        :label="trans('rebind_to_other_url')"
        :icon="LinkIcon"
    />
</template>
