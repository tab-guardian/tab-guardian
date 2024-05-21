<script setup lang="ts">
import { useTransStore } from '@settings/stores/trans'
import { useMainStore } from '@settings/stores/main'
import Section from '@settings/components/Section.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'

const { trans } = useTransStore()
const store = useMainStore()
</script>

<template>
    <div>
        <Section :title="trans('Additional Options')">
            <SlideSwitch
                @changed="store.updateSettings"
                v-model="store.settings.encryptAfterRestore"
            >
                {{ trans('Lock the group back after restoring the links') }}
            </SlideSwitch>
        </Section>
    </div>
</template>
