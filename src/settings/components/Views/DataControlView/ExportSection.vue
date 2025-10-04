<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { ref, onMounted } from 'vue'
import { trans } from '@common/modules/trans'
import { showToast } from '@common/modules/showToast'
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import ArrowDownTrayIcon from '@common/components/Icons/ArrowDownTrayIcon.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'

const groupStore = useGroupStore()
const exporting = ref<boolean>(false)
const usePassword = ref<boolean>(false)

onMounted(async () => {
    await groupStore.loadGroupsFromStorage()
})

async function exportGroups(): Promise<void> {
    const groups = groupStore.groups

    if (groups.length === 0) {
        showToast(trans('no_groups_export'), 'error')
        return
    }

    exporting.value = true

    const json = JSON.stringify(groups)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'tab-groups-export.json'
    a.click()

    URL.revokeObjectURL(url)

    exporting.value = false
}
</script>

<template>
    <Section
        :title="trans('export_tab_groups')"
        :subtitle="trans('export_tab_groups_desc')"
    >
        <SlideSwitch
            @changed="usePassword = !usePassword"
            v-model="usePassword"
        >
            {{ trans('protect_export_using_pass') }}
        </SlideSwitch>

        <Button
            @clicked="exportGroups"
            :icon="ArrowDownTrayIcon"
            :loading="exporting"
            class="mt-4"
        >
            {{ trans('export') }}
        </Button>
    </Section>
</template>
