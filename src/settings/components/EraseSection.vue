<script setup lang="ts">
import { useTransStore } from '@settings/stores/trans'
import { useMainStore } from '@settings/stores/main'
import Section from '@settings/components/Section.vue'
import Button from '@settings/components/Form/Button.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'
import TrashIcon from '@common/components/Icons/TrashIcon.vue'

const { trans } = useTransStore()
const store = useMainStore()
</script>

<template>
    <div>
        <Section :title="trans('Erase all groups')">
            <div class="flex items-center justify-between gap-3">
                <SlideSwitch>
                    {{ trans('I confirm that I want to delete all groups') }}
                </SlideSwitch>

                <Button additionalClasses="bg-red-600 dark:bg-red-400">
                    <TrashIcon class="w-5 h-5" />
                    {{ trans('Erase all groups') }}
                </Button>
            </div>
        </Section>
    </div>
</template>
