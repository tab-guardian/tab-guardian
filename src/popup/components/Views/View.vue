<script setup lang="ts">
import BackButton from '@/components/Views/GroupView/GroupControls/BackButton.vue'
import { RouteLocationRaw, useRouter } from 'vue-router'

type Props = {
    title?: string
    subtitle?: string
    redirectRoute?: RouteLocationRaw
}

const props = defineProps<Props>()

const router = useRouter()

function redirect(): void {
    if (props.redirectRoute) {
        router.push(props.redirectRoute)
        return
    }

    router.go(-1)
}
</script>

<template>
    <div class="absolute inset-0 bg-page p-2">
        <h2 v-if="title" class="flex items-center gap-2 text-lg">
            <BackButton @click="redirect" />
            {{ title }}
        </h2>

        <div v-else class="flex justify-between gap-1">
            <BackButton @click="redirect" />
            <slot name="controls" />
        </div>

        <p v-if="subtitle" class="mt-1 text-sm text-font-gray leading-4">
            {{ subtitle }}
        </p>

        <slot></slot>
    </div>
</template>
