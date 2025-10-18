<script setup lang="ts">
import type { Group } from '@common/types'
import { computed } from 'vue'
import { getIcons } from '@/modules/getIcons'
import { isEmoji } from '@common/modules'
import { config } from '@common/config'

const props = defineProps<{ group: Group }>()

const showGroupIcon = computed<boolean>(() =>
    config.GROUP_ICON_START.some(prefix => {
        return props.group.icon && props.group.icon.startsWith(prefix)
    }),
)
</script>

<template>
    <div
        v-if="!group.isPrivate && group.icon"
        class="w-6 h-6 flex items-center justify-center rounded-md"
    >
        <img v-if="showGroupIcon" :src="group.icon" class="size-5" />

        <span v-else-if="isEmoji(group.icon)" class="text-lg mt-1">
            {{ group.icon }}
        </span>

        <component v-else :is="getIcons(group.icon)" class="size-5" />
    </div>
</template>
