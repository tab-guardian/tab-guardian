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
            <span>{{ props.content }}</span>

            <slot />

            <div class="popup__buttons">
                <slot name="buttons" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="sass">
.popup
    position: absolute
    top: 50%
    left: 20px
    right: 20px
    background-color: var(--tg-color-bg)
    border-radius: 8px
    transform: translateY(-50%)
    padding: 15px
    z-index: 1

    span
        font-size: 1rem
        margin: 0

    &__buttons
        display: flex
        gap: 10px
        justify-content: flex-end
        margin-top: 15px
</style>
