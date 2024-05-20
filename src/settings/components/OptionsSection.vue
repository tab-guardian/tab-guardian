<script setup lang="ts">
import { useTransStore } from '@settings/stores/trans'
import { useMainStore } from '@settings/stores/main'
import Section from '@settings/components/Section.vue'
import Switch from '@common/components/Form/Switch.vue'
import Spinner from '@/components/Spinner.vue'

const { trans } = useTransStore()
const store = useMainStore()
</script>

<template>
    <Section :title="trans('Additional Options')">
        <Spinner v-if="store.loading" />

        <div v-else>
            <Switch
                @changed="store.updateSettings"
                v-model="store.settings.encryptAfterRestore"
            >
                {{ trans('Lock the group back after restoring the links') }}
            </Switch>
        </div>
    </Section>
</template>
