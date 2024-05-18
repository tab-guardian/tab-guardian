<script setup lang="ts">
import { useSelectTabsStore } from '@/stores/selectTabs'
import { useTransStore } from '@/stores/trans'
import Spinner from '@/components/Spinner.vue'
import TabItem from '@/components/Views/SelectTabsView/TabItem.vue'
import Message from '@common/components/Message.vue'

const store = useSelectTabsStore()
const { trans } = useTransStore()
</script>

<template>
    <Spinner v-if="store.loading" />

    <Message v-else-if="store.links.length === 0">
        {{ trans('No tabs found') }}
    </Message>

    <div v-else class="flex flex-col gap-2">
        <TabItem v-for="link in store.links" :key="link.id" :link />
    </div>
</template>
