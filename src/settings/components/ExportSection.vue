<script setup lang="ts">
import trans from '@common/modules/trans'
import { useGroupStore } from '@/stores/group'
import showToast from '@common/modules/showToast'
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import ArrowDownTrayIcon from '@common/components/Icons/ArrowDownTrayIcon.vue'

const groupStore = useGroupStore()

async function exportGroups(): Promise<void> {
    const groups = groupStore.groups.filter(group => !group.isPrivate)

    if (groups.length === 0) {
        showToast(trans('No groups to export'), 'error')
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
        :title="trans('Export Tab Groups')"
        :subtitle="
            trans(
                'Export all of your tab groups. Keep in mind that private groups are not going to be exported. If you want to export them, you need to do it for each private group separately',
            )
        "
    >
        <Button @clicked="exportGroups" class="mt-4">
            <ArrowDownTrayIcon class="w-5 h-5" />
            {{ trans('Export') }}
        </Button>
    </Section>
</template>
