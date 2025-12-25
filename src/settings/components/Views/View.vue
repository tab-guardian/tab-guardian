<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
    <h1 class="text-2xl mb-4">{{ title }}</h1>
    <div class="flex flex-col gap-3"><slot /></div>
</template>
