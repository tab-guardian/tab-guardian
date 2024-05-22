<script setup lang="ts">
import { useTransStore } from '@/stores/trans'
import { useSettingsStore } from '@/stores/settings'
import Section from '@settings/components/Section.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'

const { trans } = useTransStore()
const store = useSettingsStore()
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
