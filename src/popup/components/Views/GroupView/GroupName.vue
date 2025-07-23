<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { Group } from '@/types'
import { useGroupStore } from '@/stores/group'
import GroupIcon from '@/components/Views/MainView/Groups/GroupIcon.vue'

defineProps<{ group: Group }>()

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
    <div class="flex items-center gap-1 relative">
        <GroupIcon v-if="group.icon" :group />

        <form
            v-if="store.isTitleFieldActive"
            @submit.prevent="store.isTitleFieldActive = false"
            class="w-full"
        >
            <input
                v-model="store.newGroup.name"
                @keydown.enter="store.renameGroup"
                @blur="store.renameGroup"
                :class="classes"
                :maxlength="store.groupNameMaxLength"
                ref="inputRef"
                type="text"
                class="bg-transparent text-font w-full outline-none pr-16"
                autofocus
            />
        </form>

        <h2
            v-else
            v-on:dblclick="store.startGroupRenaming"
            :class="classes"
            class="border border-transparent select-none"
        >
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
