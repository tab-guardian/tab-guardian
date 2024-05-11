<script setup lang="ts">
import Overlay from '@/components/Navbar/Sidebar/Overlay.vue'

type Props = {
    content: string
}

type Emits = {
    (e: 'cancel'): void
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()
</script>

<template>
    <div>
        <Overlay @click="emit('cancel')" />

        <div class="popup">
            <span class="popup__title">{{ props.content }}</span>

            <slot />

            <div class="popup__buttons">
                <slot name="buttons" />
            </div>
        </div>
    </div>
</template>
