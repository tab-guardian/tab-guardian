<script setup lang="ts">
import { useTransStore } from '@/stores/transStore'
import { useGroupStore } from '@/stores/groupStore'

const { trans } = useTransStore()
const { saveGroup } = useGroupStore()
</script>

<template>
    <div>
        <div>
            <button @click="saveGroup">
                {{ trans('Quick Save') }}
            </button>
        </div>

        <span>{{ trans('Click the shield to save as a private group') }}</span>
    </div>
</template>