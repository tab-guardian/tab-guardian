<script setup lang="ts">
import Overlay from '@/components/Navbar/Sidebar/Overlay.vue'

const emit = defineEmits<{
    (e: 'cancel'): void
}>()

defineProps<{
    content: string
    description?: string
}>()
</script>

<template>
    <div>
        <Overlay @click="emit('cancel')" />

        <div
            class="fixed top-1/2 left-1/2 -translate-x-1/2 bg-secondary rounded-md -translate-y-1/2 p-4 z-20 w-[90%] max-w-96"
        >
            <span class="text-lg mb-3 block">{{ content }}</span>

            <div class="flex items-center gap-3">
                <p v-if="description" class="text-sm mb-4 mt-2 opacity-80">
                    {{ description }}
                </p>

                <slot name="right-side" />
            </div>

            <slot />

            <div class="flex gap-2 justify-end mt-3">
                <slot name="buttons" />
            </div>
        </div>
    </div>
</template>
