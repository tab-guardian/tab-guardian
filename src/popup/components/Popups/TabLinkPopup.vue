<script setup lang="ts">
import type { Group, Link } from '@/types'
import { computed } from 'vue'
import { trans } from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import Popup from '@/components/Popups/Popup.vue'

const { closePopup, getSharedData } = usePopupStore()
const groupStore = useGroupStore()
const group = computed<Group | null>(() => groupStore.selectedGroup)
const link = computed<Link | null>(() => getSharedData<Link>())
</script>

<template>
    <Popup v-if="link" :content="link.title" @cancel="closePopup('tabLinkView')">
        {{ link.url }}
    </Popup>
</template>
