<script setup lang="ts">
import LeftSlideTransition from '@/components/Transitions/LeftSlideTransition.vue'
import Modal from '@/components/Modal.vue'
import { Group } from '@/types'

type Props = {
    groups: Group
}

type Emits = {
    (e: 'filteredGroups', groups: Group[]): void
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()
</script>

<template>
    <LeftSlideTransition>
        <Modal class="select-tabs">
            <h1>Select Tabs</h1>
        </Modal>
    </LeftSlideTransition>
</template>

<style lang="sass" scoped>
.select-tabs
    //
</style>