<script setup lang="ts">
import type { Group as GroupType } from '@common/types'
import { computed } from 'vue'
import { getIcons } from '@/modules/getIcons'
import { isEmoji, GROUP_ICON_START } from '@common/modules/utils'

const props = defineProps<{ group: GroupType }>()

const showGroupIcon = computed<boolean>(() =>
    GROUP_ICON_START.some(prefix => {
        return props.group.icon && props.group.icon.startsWith(prefix)
    }),
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
