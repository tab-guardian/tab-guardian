<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { Group } from '@/types'
import { useGroupStore } from '@/stores/group'

const store = useGroupStore()

type Props = {
    group: Group
}

const props = defineProps<Props>()
const classes = 'text-lg my-1 px-2 py-0.5'
const inputRef = ref<HTMLInputElement | null>(null)

watchEffect(() => {
    if (store.isTitleFieldActive) {
        inputRef.value?.focus()
    }
})
</script>

<template>
    <input
        v-if="store.isTitleFieldActive"
        type="text"
        v-model="store.newGroup.name"
        @blur="store.renameGroup"
        autofocus
        :class="classes"
        ref="inputRef"
        class="border border-border bg-safe text-font w-full rounded-md"
    />

    <h2 v-else :class="classes" class="border border-transparent">
        {{ props.group.name }}
    </h2>
</template>
