<script setup lang="ts">
import { useTransStore } from '@/stores/useTransStore'
import { useSettingsModalStore } from '@/stores/modals/useSettingsModalStore'
import Modal from '@/components/Modals/Modal.vue'
import LeftSlideTransition from '@/components/Transitions/LeftSlideTransition.vue'
import PasswordSection from '@/components/Modals/SettingsModal/Sections/PasswordSection.vue'

const { trans } = useTransStore()
const store = useSettingsModalStore()
</script>

<template>
    <LeftSlideTransition>
        <Modal
            v-if="store.isOpen"
            :title="trans('Settings')"
            :subtitle="trans('Change the extension configurations here')"
        >
            <div class="settings">
                <PasswordSection />
            </div>
        </Modal>
    </LeftSlideTransition>
</template>

<style lang="sass" scoped>
.settings
    margin-top: 8px
</style>
