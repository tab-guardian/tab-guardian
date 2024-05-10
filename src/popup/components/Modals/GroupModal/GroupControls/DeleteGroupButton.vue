<script setup lang="ts">
import Control from '@/components/Control.vue'
import TrashIcon from '@/components/Icons/TrashIcon.vue'
import { useGroupModalStore } from '@/stores/modals/useGroupModalStore'

const store = useGroupModalStore()
</script>

<template>
    <Control @click="store.askToDelete = true">
        <TrashIcon style="width: 100%" />
    </Control>
</template>
