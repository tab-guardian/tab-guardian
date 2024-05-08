<script setup lang="ts">
import Overlay from '@/components/Navbar/Sidebar/Overlay.vue'

type Props = {
    content: string
}

const { content } = defineProps<Props>()
</script>

<template>
    <div>
        <Overlay />

        <div class="popup">
            <span>{{ content }}</span>

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
    background-color: var(--tg-color-bg-light)
    border-radius: 8px
    transform: translateY(-50%)
    padding: 20px
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