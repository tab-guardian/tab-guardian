<script setup lang="ts">
import OptionsSection from '@settings/components/Views/GeneralView/OptionsSection.vue'
import View from '@settings/components/Views/View.vue'
import { trans } from '@common/modules'
</script>

<template>
    <View :title="trans('general')">
        <OptionsSection />
    </View>
</template>
