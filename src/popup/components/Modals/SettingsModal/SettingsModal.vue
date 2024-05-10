<script setup lang="ts">
import { useTransStore } from '@/stores/useTransStore'
import { useSettingsModalStore } from '@/stores/modals/useSettingsModalStore'
import Modal from '@/components/Modal.vue'
import LeftSlideTransition from '@/components/Transitions/LeftSlideTransition.vue'

const { trans } = useTransStore()
const store = useSettingsModalStore()
</script>

<template>
    <LeftSlideTransition>
        <Modal
           v-if="store.isOpen"
           class="settings"
           :title="trans('Settings')"
           :subtitle="trans('Change the extension configurations here')"
        >
        </Modal>
    </LeftSlideTransition>
</template>

<style lang="sass" scoped>
.settings
    //
</style>