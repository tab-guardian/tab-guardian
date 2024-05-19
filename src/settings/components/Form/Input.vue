<script setup lang="ts">
type Props = {
    label: string
    id: string
    type: 'text' | 'password'
}

const props = defineProps<Props>()
const modelValue = defineModel()
</script>

<template>
    <label :for="props.id" class="block mb-0.5 mx-1 text-sm">
        {{ props.label }}
    </label>

    <input
        :id="props.id"
        :type="props.type"
        class="rounded-lg px-3 py-2 w-full bg-page border border-border focus:outline outline-2 outline-primary"
        v-model="modelValue"
        :placeholder="props.label"
    />
</template>
