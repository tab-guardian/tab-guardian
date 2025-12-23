<script setup lang="ts">
import type { Component } from 'vue'
import type { Modals } from '@common/types/modal'
import { useModalStore } from '@/stores/modal'
import AppearTransition from '@common/components/Transitions/AppearTransition.vue'

const { isModalVisible } = useModalStore()

defineProps<{
    modals: Array<{ name: keyof Modals; comp: Component }>
}>()
</script>

<template>
    <AppearTransition v-for="modal in modals" :key="modal.name">
        <Component :is="modal.comp" v-if="isModalVisible(modal.name)" />
    </AppearTransition>
</template>
