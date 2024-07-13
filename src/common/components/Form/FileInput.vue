<script setup lang="ts">
type Props = {
    id: string
    label?: string
}

type Emits = {
    (e: 'chosen', f: File, elem: HTMLInputElement): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function onFileChange(e: Event): void {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]

    if (file) {
        emit('chosen', file, e.target as HTMLInputElement)
    }
}
</script>

<template>
    <div class="border-4 border-dotted border-gray-500 rounded-lg w-96">
        <label class="p-4 w-full block text-center">
            <input class="hidden" @change="onFileChange" type="file" name="file" />
            <span class="text-xl text-font-gray">{{ props.label }}</span>
        </label>
    </div>
</template>
