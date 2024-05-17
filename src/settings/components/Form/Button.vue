<script setup lang="ts">
type Props = {
    label: string
}

const { label } = defineProps<Props>()
</script>

<template>
    <div class="text-right">
        <button type="submit" class="bg-primary text-page px-6 py-2 rounded-lg">
            {{ label }}
        </button>
    </div>
</template>
