<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { Group } from '@/types'
import { useGroupStore } from '@/stores/group'

defineProps<{
    group: Group
}>()

const classes = 'text-lg my-1 px-2 py-0.5'
const inputRef = ref<HTMLInputElement | null>(null)

const store = useGroupStore()

watchEffect(() => {
    if (store.isTitleFieldActive) {
        inputRef.value?.focus()
    }
})
</script>

<template>
    <div class="relative">
        <input
            v-if="store.isTitleFieldActive"
            v-model="store.newGroup.name"
            @blur="store.renameGroup"
            :class="classes"
            :maxlength="store.groupNameMaxLength"
            ref="inputRef"
            type="text"
            class="border border-border bg-safe text-font w-full rounded-md pr-16"
            autofocus
        />

        <h2 v-else :class="classes" class="border border-transparent">
            {{ group.name }}
        </h2>

        <small
            v-if="store.isTitleFieldActive"
            class="absolute top-2.5 bottom-2.5 right-2 flex items-center bg-black/10 dark:bg-black/40 rounded-md px-1.5"
        >
            {{ `${store.groupNameLength} / ${store.groupNameMaxLength}` }}
        </small>
    </div>
</template>
