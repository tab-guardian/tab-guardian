<script setup lang="ts">
import EllipsisVerticalIcon from '@/components/Icons/EllipsisVerticalIcon.vue'
import Control from '@/components/Control.vue'
import { usePopupStore } from '@/stores/usePopupStore'

const { open } = usePopupStore()
</script>

<template>
    <Control @click="open('groupModalMenu')">
        <EllipsisVerticalIcon style="width: 100%" />
    </Control>
</template>
