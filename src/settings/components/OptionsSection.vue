<script setup lang="ts">
import { useTransStore } from '@settings/stores/trans'
import { useMainStore } from '@settings/stores/main'
import Section from '@settings/components/Section.vue'

const { trans } = useTransStore()
const store = useMainStore()
</script>

<template>
    <div>
        <Section :title="trans('Additional Options')">
            <Switch
                @changed="store.updateSettings"
                v-model="store.settings.encryptAfterRestore"
            >
                {{ trans('Lock the group back after restoring the links') }}
            </Switch>
        </Section>
    </div>
</template>
