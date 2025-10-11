<script setup lang="ts">
import type { Group as GroupType } from '@common/types'
import { computed } from 'vue'
import { getIcons } from '@/modules/getIcons'
import { isEmoji } from '@common/modules/utils'

const { group } = defineProps<{ group: GroupType }>()

const allowedIconStart = [
    'http', // http and https images
    'data:image', // base64 images
    'chrome-extension', // images from chrome storage
    'moz-extension', // images from chrome storage
]

const showGroupIcon = computed<boolean>(() =>
    allowedIconStart.some(prefix => group.icon && group.icon.startsWith(prefix)),
)
</script>

<template>
    <div v-if="group.icon" class="w-6 h-6 flex items-center justify-center">
        <img v-if="showGroupIcon" :src="group.icon" class="w-5 h-5" />

        <span v-else-if="isEmoji(group.icon)">
            {{ group.icon }}
        </span>

        <component v-else :is="getIcons()[group.icon]" class="w-5 h-5" />
    </div>
</template>
