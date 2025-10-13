<script setup lang="ts">
import type { Component } from 'vue'
import type { Popups } from '@common/types/popup'
import { usePopupStore } from '@/stores/popup'
import AppearTransition from '@common/components/Transitions/AppearTransition.vue'

const { isOpenPopup } = usePopupStore()

defineProps<{
    popups: Array<{ name: keyof Popups; comp: Component }>
}>()
</script>

<template>
    <AppearTransition v-for="popup in popups" :key="popup.name">
        <Component :is="popup.comp" v-if="isOpenPopup(popup.name)" />
    </AppearTransition>
</template>
