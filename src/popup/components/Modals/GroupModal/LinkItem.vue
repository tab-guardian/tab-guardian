<script setup lang="ts">
import type { Link } from '@/types'
import DeleteLinkButton from '@/components/Modals/GroupModal/DeleteLinkButton.vue'

type Props = {
    link: Link
    groupId: number
}

const props = defineProps<Props>()
</script>

<template>
    <a
        :href="props.link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="link-item"
    >
        <div class="link-item__inner">
            <img :src="props.link.favIconUrl" alt="icon" />

            <div class="link-item__content">
                <span :title="props.link.title">
                    {{ props.link.title }}
                </span>

                <small :title="props.link.url">
                    {{ props.link.url }}
                </small>
            </div>
        </div>

        <DeleteLinkButton :linkId="link.id" :groupId />
    </a>
</template>
