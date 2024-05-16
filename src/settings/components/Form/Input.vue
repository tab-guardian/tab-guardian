<script setup lang="ts">
type Props = {
    label: string
    id: string
}

const { label, id } = defineProps<Props>()
const modelValue = defineModel()
</script>

<template>
    <label :for="id" class="block mb-0.5 mx-1">
        {{ label }}
    </label>

    <input
        :id="id"
        class="rounded-lg px-3 py-2 w-full bg-main-secondary border border-border"
        v-model="modelValue"
        :placeholder="label"
    />
</template>
