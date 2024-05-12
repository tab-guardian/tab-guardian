<script setup lang="ts">
import ChevronRightIcon from '@/components/Icons/ChevronRightIcon.vue'
import Control from '@/components/Control.vue'
</script>

<template>
    <Control>
        <ChevronRightIcon
            :style="{
                transform: 'rotate(180deg)',
                width: '100%',
            }"
        />
    </Control>
</template>
