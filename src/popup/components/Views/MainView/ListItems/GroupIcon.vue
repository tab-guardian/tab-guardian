<script setup lang="ts">
import type { Group, Folder } from '@common/types'
import { computed } from 'vue'
import { getIcons } from '@/modules/getIcons'
import { isComponentIcon } from '@common/modules/group'
import { config } from '@common/config'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import ShieldExclamationIcon from '@common/components/Icons/ShieldExclamationIcon.vue'
import FolderIcon from '@common/components/Icons/FolderIcon.vue'

type Props = {
    folder?: Folder
    group?: Group
}

const props = defineProps<Props>()

const showGroupIcon = computed<boolean>(() => {
    if (props.folder) {
        return false
    }

    return config.GROUP_ICON_START.some(prefix => {
        if (!props.group) {
            return false
        }

        return props.group.icon && props.group.icon.startsWith(prefix)
    })
})
</script>

<template>
    <div class="size-6 flex items-center justify-center">
        <component
            v-if="!group"
            :is="FolderIcon"
            class="size-5"
            style="color: #a08725"
        />

        <div v-else-if="group.isPrivate">
            <ShieldCheckIcon
                v-if="group.isEncrypted"
                class="size-6 text-success"
                :class="{ 'text-red-400': !group.algo }"
            />

            <ShieldExclamationIcon v-else class="size-6 text-red-400" />
        </div>

        <img v-else-if="showGroupIcon" :src="group.icon" class="size-5" />

        <component
            v-else-if="group.icon && isComponentIcon(group.icon)"
            :is="getIcons(group.icon)"
            class="size-5"
        />

        <span v-else-if="group.icon" class="text-lg mt-1">
            {{ group.icon }}
        </span>

        <div
            v-else
            class="flex items-center justify-center size-6 text-primary text-sm"
        >
            {{ group.links.length }}
        </div>
    </div>
</template>
