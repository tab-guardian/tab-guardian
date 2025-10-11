<script setup lang="ts">
import EraseSection from '@settings/components/Views/DataControlView/EraseSection.vue'
import ExportSection from '@settings/components/Views/DataControlView/ExportSection.vue'
import ImportSection from '@settings/components/Views/DataControlView/ImportSection.vue'
import ClearCacheSection from '@settings/components/Views/DataControlView/ClearCacheSection.vue'
import View from '@settings/components/Views/View.vue'
import { trans } from '@common/modules/utils'
</script>

<template>
    <View :title="trans('data_control')">
        <ClearCacheSection />
        <ExportSection />
        <ImportSection />
        <EraseSection />
    </View>
</template>
