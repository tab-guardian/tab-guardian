<script setup lang="ts">
import { ref } from 'vue'
import { useTransStore } from '@settings/stores/trans'
import { useMainStore } from '@settings/stores/main'
import Section from '@settings/components/Section.vue'
import showToast from '@common/modules/showToast'

const { trans } = useTransStore()
const store = useMainStore()

const checked = ref<boolean>(false)
</script>

<template>
    <Section :title="trans('Additional Options')">
        <label for="switch1">Remember Me</label>
        here
    </Section>
</template>
