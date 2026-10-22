<script setup lang="ts">
import type { Group } from '@common/types'
import { computed } from 'vue'
import { trans } from '@common/modules'
import { runtime } from '@common/modules/runtime'
import { showToast } from '@common/modules/toast'
import { useOpenGroup } from '@/composables/useOpenGroup'

const props = defineProps<{ group: Group }>()

const { open } = useOpenGroup()

const isEmptyGroup = computed(() => props.group.links.length === 0)

async function openGroup(): Promise<void> {
    const toastMsgs = await open(props.group)

    for (const toastMsg of toastMsgs) {
        showToast(toastMsg)
    }
}
</script>

<template>
    <img
        :src="runtime.getUrl('images/tab-icons/up.png')"
        alt="Open tabs"
        @click.prevent="openGroup"
        v-tippy="trans(isEmptyGroup ? 'no_tabs_this_group' : 'open_tabs')"
        class="size-4 transition-transform hover:scale-110 dark:invert"
        :class="{
            'cursor-not-allowed opacity-40': isEmptyGroup,
        }"
    />
</template>
