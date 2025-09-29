<script setup lang="ts">
import EraseSection from '@settings/components/Views/DataControlView/EraseSection.vue'
import ExportSection from '@settings/components/Views/DataControlView/ExportSection.vue'
import ImportSection from '@settings/components/Views/DataControlView/ImportSection.vue'
import View from '@settings/components/Views/View.vue'
import { trans } from '@common/modules/trans'
</script>

<template>
    <View :title="trans('data_control')">
        <ExportSection />
        <ImportSection />
        <EraseSection />
    </View>
</template>
