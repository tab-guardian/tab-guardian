<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { onMounted } from 'vue'
import { trans } from '@common/modules/trans'
import { showToast } from '@common/modules/showToast'
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import ArrowDownTrayIcon from '@common/components/Icons/ArrowDownTrayIcon.vue'

const groupStore = useGroupStore()

onMounted(async () => {
    await groupStore.loadGroupsFromStorage()
})

async function exportGroups(): Promise<void> {
    const groups = groupStore.groups.filter(group => !group.isPrivate)

    if (groups.length === 0) {
        showToast(trans('no_groups_export'), 'error')
        return
    }

    const json = JSON.stringify(groups)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'tab-groups-export.json'
    a.click()

    URL.revokeObjectURL(url)
}
</script>

<template>
    <Section
        :title="trans('export_tab_groups')"
        :subtitle="trans('export_all_your_groups')"
    >
        <Button @clicked="exportGroups" class="mt-4">
            <ArrowDownTrayIcon class="w-5 h-5" />
            {{ trans('export') }}
        </Button>
    </Section>
</template>
