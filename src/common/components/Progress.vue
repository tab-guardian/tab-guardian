<script setup lang="ts">
import { useProgressStore } from '@/stores/progress'
import ProgressBar from '@common/components/ProgressBar.vue'

const progressStore = useProgressStore()
</script>

<template>
    <ProgressBar :current="progressStore.current" :max="progressStore.max" />
</template>
