<script setup lang="ts">
import { useSelectTabsStore } from '@/stores/useSelectTabsStore'
import { useTransStore } from '@/stores/useTransStore'
import Spinner from '@/components/Spinner.vue'
import TabItem from '@/components/Views/SelectTabsView/TabItem.vue'

const store = useSelectTabsStore()
const { trans } = useTransStore()
</script>

<template>
    <Spinner v-if="store.loading" />

    <h3 v-else-if="store.links.length === 0" class="message">
        {{ trans('No tabs found') }}
    </h3>

    <div v-else class="tabs">
        <TabItem v-for="link in store.links" :key="link.id" :link />
    </div>
</template>

<style lang="sass" scoped>
.tabs
    display: flex
    flex-direction: column
    gap: 5px
</style>
