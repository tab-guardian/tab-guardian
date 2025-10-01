<script setup lang="ts">
import { ref } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

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
    if (!e.dataTransfer) {
        return
    }

    drag.value = false

    const files = e.dataTransfer.files

    if (!files.length || !inputRef.value) {
        return
    }

    inputRef.value!.files = files
    emit('chosen', files[0], inputRef.value)
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
        <span
            class="text-xl pointer-events-none"
            :class="drag ? 'text-green-500' : 'text-gray-500'"
        >
            {{ label }}
        </span>

        <input
            class="hidden pointer-events-none"
            @change="onFileChange"
            type="file"
            name="file"
            ref="inputRef"
            :id
        />
    </label>
</template>
