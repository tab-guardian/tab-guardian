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

async function dropImage(e: DragEvent): Promise<void> {
    e.preventDefault()

    if (!e.dataTransfer) {
        return
    }

    drag.value = false

    const files = e.dataTransfer.files

    console.log(files)
}
</script>

<template>
    <div
        @dragover.prevent="drag = true"
        @drag.leave.self="drag = false"
        @drop.self.prevent="dropImage"
        :class="drag ? 'border-green-500' : 'border-gray-500'"
        class="border-4 border-dotted rounded-lg w-96"
    >
        <label :for="id" class="p-4 w-full block text-center">
            <span class="text-xl text-font-gray">{{ label }}</span>
            <input
                class="hidden"
                @change="onFileChange"
                type="file"
                name="file"
                :id
            />
        </label>
    </div>
</template>
