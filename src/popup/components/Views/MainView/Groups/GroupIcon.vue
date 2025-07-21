<script setup lang="ts">
import type { Group as GroupType } from '@/types'
import getIcons from '@/modules/getIcons'
import { isSingleEmoji } from '@common/modules/emoji/isSingleEmoji'

type Props = {
    group: GroupType
}

const { group } = defineProps<Props>()
</script>

<template>
    <div class="w-6 h-6 flex items-center justify-center">
        <img
            v-if="
                group.icon!.startsWith('http') ||
                group.icon!.startsWith('chrome-extension')
            "
            :src="group.icon"
            class="w-5 h-5"
        />

        <span v-else-if="group.icon && isSingleEmoji(group.icon)">
            {{ group.icon }}
        </span>

        <component v-else :is="getIcons()[group.icon!]" class="w-5 h-5" />
    </div>
</template>
