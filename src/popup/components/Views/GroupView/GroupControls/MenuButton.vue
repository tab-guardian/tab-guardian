<script setup lang="ts">
import EllipsisVerticalIcon from '@/components/Icons/EllipsisVerticalIcon.vue'
import Control from '@/components/Control.vue'
import { usePopupStore } from '@/stores/usePopupStore'

const { openPopup } = usePopupStore()

function openPopupHandler(): void {
    openPopup('groupView')
}
</script>

<template>
    <Control @click="openPopupHandler">
        <EllipsisVerticalIcon style="width: 100%" />
    </Control>
</template>
