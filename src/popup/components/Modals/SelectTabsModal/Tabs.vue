<script setup lang="ts">
import { useSelectTabsModalStore } from '@/stores/modals/useSelectTabsModalStore'
import Spinner from '@/components/Spinner.vue'
import { useTransStore } from '@/stores/useTransStore'

const store = useSelectTabsModalStore()
const { trans } = useTransStore()
</script>

<template>
    <Spinner v-if="store.loading" />

    <h3 v-else-if="store.links.length === 0" class="no-tabs">
        {{ trans('No tabs found') }}
    </h3>

    <div v-else class="tabs">
        <div
            v-for="link in store.links"
            :key="link.id"
            class="link-item"
            :class="{ 'link-item--selected': store.selectedIds.includes(link.id) }"
            @click="store.toggleSelect(link.id)"
        >
            <div class="link-item__inner">
                <img :src="link.favIconUrl" alt="icon">
                <span>{{ link.title }}</span>
            </div>

            <label class="link-item__checkbox">
                <input type="checkbox">

                <div
                    v-if="store.selectedIds.includes(link.id)"
                    class="link-item__checkbox__checkmark"
                ></div>
            </label>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.no-tabs
    font-size: 1.2rem
    text-align: center
    margin-top: 20px
    font-weight: normal

.tabs
    display: flex
    flex-direction: column
    gap: 6px
</style>