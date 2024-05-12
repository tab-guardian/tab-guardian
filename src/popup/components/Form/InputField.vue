<script setup lang="ts">
import CheckIcon from '@/components/Icons/CheckIcon.vue'

type Emits = {
    (e: 'submit'): void
}

type Props = {
    placeholder?: string
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()
const modelValue = defineModel()
</script>

<template>
    <form @submit.prevent="emit('submit')" class="form">
        <input
            type="password"
            class="input"
            :placeholder="props.placeholder"
            v-model="modelValue"
        />

        <button type="submit">
            <CheckIcon width="20" height="20" />
        </button>
    </form>
</template>

<style lang="sass" scoped>
.form
    display: flex
    align-items: center
    gap: 5px

    button
        background-color: var(--tg-color-primary)
        border: none
        transition: background-color .2s
        height: 30px
        border-radius: 4px
        flex: 1
        display: flex
        align-items: center
        justify-content: center
        cursor: pointer
        color: var(--tg-color-bg)

        &:hover
            background-color: var(--tg-color-primary-hover)
</style>
