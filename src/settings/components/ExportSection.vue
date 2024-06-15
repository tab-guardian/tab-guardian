<script setup lang="ts">
import { ref } from 'vue'
import { useTransStore } from '@/stores/trans'
import { useGroupStore } from '@/stores/group'
import { useSettingsStore } from '@/stores/settings'
import showToast from '@common/modules/showToast'
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import ArrowDownTrayIcon from '@common/components/Icons/ArrowDownTrayIcon.vue'

const { trans } = useTransStore()
const store = useSettingsStore()
const groupStore = useGroupStore()
const isConfirmed = ref<boolean>(false)

async function exportEverything(): Promise<void> {
    if (store.loading) {
        return
    }

    if (!isConfirmed.value) {
        showToast(trans('Confirm that you want to delete all groups'), 'error')
        return
    }

    store.loading = true
    await groupStore.deleteAllGroups()

    showToast(trans('All the groups have been deleted'))

    isConfirmed.value = false
    store.loading = false
}
</script>

<template>
    <form @submit.prevent="exportEverything">
        <Section :title="trans('Export all the Data')">
            <div class="flex items-center justify-between gap-3">
                <Button @clicked="exportEverything">
                    <ArrowDownTrayIcon class="w-5 h-5" />
                    {{ trans('Export everything') }}
                </Button>
            </div>
        </Section>
    </form>
</template>
