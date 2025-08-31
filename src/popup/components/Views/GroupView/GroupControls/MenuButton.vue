<script setup lang="ts">
import EllipsisVerticalIcon from '@common/components/Icons/EllipsisVerticalIcon.vue'
import Control from '@/components/Control.vue'
import { usePopupStore } from '@/stores/popup'

const { openPopup } = usePopupStore()

function openPopupHandler(): void {
    openPopup('groupMenuView')
}
</script>

<template>
    <Control @click="openPopupHandler">
        <EllipsisVerticalIcon style="width: 100%" />
    </Control>
</template>
