<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
    id: string
    label?: string
}>()

const emit = defineEmits<{
    (e: 'chosen', f: File, elem: HTMLInputElement): void
}>()

const drag = ref<boolean>(false)

function onFileChange(e: Event): void {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]

    if (file) {
        emit('chosen', file, e.target as HTMLInputElement)
    }
}

async function dropFile(e: DragEvent): Promise<void> {
    console.log(e.dataTransfer)

    if (!e.dataTransfer) {
        return
    }

    drag.value = false

    const files = e.dataTransfer.files

    console.log(files)
}
</script>

<template>
    <label
        @dragover.prevent="drag = true"
        @dragleave.self="drag = false"
        @drop.self.prevent="dropFile"
        :class="drag ? 'border-green-500' : 'border-gray-500'"
        class="border-4 border-dotted rounded-lg h-20 p-4 flex items-center justify-center"
    >
        <span class="text-xl text-font-gray pointer-events-none">{{ label }}</span>

        <input
            class="hidden pointer-events-none"
            @change="onFileChange"
            type="file"
            name="file"
            :id
        />
    </label>
</template>
