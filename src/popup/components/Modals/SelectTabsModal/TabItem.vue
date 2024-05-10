<script setup lang="ts">
import type { Link } from '@/types'
import { useSelectTabsModalStore } from '@/stores/modals/useSelectTabsModalStore'

type Props = {
    link: Link
}

const { link } = defineProps<Props>()
const store = useSelectTabsModalStore()
</script>

<template>
    <div
        class="link-item"
        :class="{ 'link-item--selected': store.selectedIds.includes(link.id) }"
        @click="store.toggleSelect(link.id)"
    >
        <div class="link-item__inner">
            <img :src="link.favIconUrl" alt="icon" />
            <span>{{ link.title }}</span>
        </div>

        <label class="link-item__checkbox">
            <input @change="store.toggleSelect(link.id)" type="checkbox" />

            <div
                v-if="store.selectedIds.includes(link.id)"
                class="link-item__checkbox__checkmark"
            ></div>
        </label>
    </div>
</template>
