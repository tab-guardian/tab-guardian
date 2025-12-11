<script setup lang="ts">
import BackButton from '@/components/Views/GroupView/GroupControls/BackButton.vue'
import { useRouter } from 'vue-router'

type Props = {
    title?: string
    subtitle?: string
}

defineProps<Props>()

const router = useRouter()
</script>

<template>
    <div class="absolute inset-0 bg-page p-2">
        <div v-if="!title" class="flex justify-between gap-1">
            <BackButton @click="router.go(-1)" />
            <slot name="controls" />
        </div>

        <h2 v-if="title" class="flex items-center gap-2 text-lg">
            <BackButton @click="router.go(-1)" />
            {{ title }}
        </h2>

        <p v-if="subtitle" class="mt-1 text-sm text-font-gray leading-4">
            {{ subtitle }}
        </p>

        <slot></slot>
    </div>
</template>
