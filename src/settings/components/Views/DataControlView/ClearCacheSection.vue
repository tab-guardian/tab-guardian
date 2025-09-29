<script setup lang="ts">
import { trans } from '@common/modules/trans'
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { showToast } from '@common/modules/showToast'
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import TrashIcon from '@common/components/Icons/TrashIcon.vue'

const settingsStore = useSettingsStore()
const bytes = ref<number>(0)

onMounted(async () => await calculateBytes())

async function calculateBytes(): Promise<void> {
    // TODO: get all the cached passwords
    // ignore passwords that attached to unlocked groups
    // turn those into a json file without slashes
    // calculate the bytes length
    bytes.value = 111
}

async function clearCache(): Promise<void> {
    if (settingsStore.loading) {
        return
    }

    settingsStore.loading = true

    // TODO: clear storage
    bytes.value = 0

    // showToast(trans('all_groups_deleted'))

    settingsStore.loading = false
}
</script>

<template>
    <Section
        v-if="bytes > 0"
        :title="trans('clear_cache')"
        :subtitle="trans('clear_cache_desc', bytes.toString())"
    >
        <Button
            @clicked="clearCache"
            :icon="TrashIcon"
        >
            {{ trans('clear_cache') }}
        </Button>
    </Section>
</template>
