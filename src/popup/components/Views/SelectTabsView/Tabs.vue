<script setup lang="ts">
import { useNewGroupStore } from '@/stores/newGroup'
import { trans } from '@common/modules/trans'
import { VueDraggableNext } from 'vue-draggable-next'
import Spinner from '@common/components/Spinner.vue'
import TabItem from '@/components/Views/SelectTabsView/TabItem.vue'
import Message from '@common/components/Message.vue'

const newGroupStore = useNewGroupStore()
</script>

<template>
    <Spinner v-if="newGroupStore.loading" />

    <Message v-else-if="newGroupStore.links.length === 0">
        {{ trans('no_tabs_found') }}
    </Message>

    <div v-else>
        <VueDraggableNext v-model="newGroupStore.links" class="space-y-2">
            <TabItem v-for="link in newGroupStore.links" :key="link.id" :link />
        </VueDraggableNext>
    </div>
</template>
