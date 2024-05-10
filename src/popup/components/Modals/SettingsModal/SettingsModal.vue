<script setup lang="ts">
import { useTransStore } from '@/stores/useTransStore'
import { useSettingsModalStore } from '@/stores/modals/useSettingsModalStore'

const { trans } = useTransStore()
const store = useSettingsModalStore()
</script>

<template>
    <LeftSlideTransition>
        <Modal
           v-if="store.isOpen"
           class="settings"
        >
            <span>here</span>
        </Modal>
    </LeftSlideTransition>
</template>

<style lang="sass" scoped>
.settings
    //
</style>