<script setup lang="ts">
import { useTransStore } from '@/stores/trans'
import Buttons from '@/components/Views/MainView/NewGroup/Buttons.vue'

const { trans } = useTransStore()
</script>

<template>
    <div class="text-center p-2 border-b border-border">
        <Buttons />

        <small class="opacity-80 text-xs mt-1.5 block">
            {{ trans('Click the shield to save as a private group') }}
        </small>
    </div>
</template>
