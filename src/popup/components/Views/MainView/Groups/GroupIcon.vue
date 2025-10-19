<script setup lang="ts">
import type { Group } from '@common/types'
import { computed } from 'vue'
import { getIcons } from '@/modules/getIcons'
import { isEmoji } from '@common/modules'
import { config } from '@common/config'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import ShieldExclamationIcon from '@common/components/Icons/ShieldExclamationIcon.vue'

const props = defineProps<{ group: Group }>()

const showGroupIcon = computed<boolean>(() =>
    config.GROUP_ICON_START.some(prefix => {
        return props.group.icon && props.group.icon.startsWith(prefix)
    }),
)
</script>

<template>
    <div class="size-6 flex items-center justify-center">
        <div v-if="group.isPrivate">
            <ShieldCheckIcon
                v-if="group.isEncrypted"
                class="size-6 text-private"
                :class="{ 'text-red-400': !group.algo }"
            />

            <ShieldExclamationIcon v-else class="size-6 text-red-400" />
        </div>

        <img v-else-if="showGroupIcon" :src="group.icon" class="size-5" />

        <span v-else-if="group.icon && isEmoji(group.icon)" class="text-lg mt-1">
            {{ group.icon }}
        </span>

        <component
            v-else-if="group.icon"
            :is="getIcons(group.icon)"
            class="size-5"
        />

        <div
            v-else
            class="flex items-center justify-center size-6 text-primary text-sm"
        >
            {{ group.links.length }}
        </div>
    </div>
</template>
