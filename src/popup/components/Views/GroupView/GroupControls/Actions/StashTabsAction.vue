<script setup lang="ts">
import Control from '@/components/Control.vue'
import ChevronRightIcon from '@/components/Icons/ChevronRightIcon.vue'
</script>

<template>
    <Control class="control">
        <ChevronRightIcon />
    </Control>
</template>

<style lang="sass" scoped>
.control
    background-color: var(--tg-color-blue)
    transform: rotate(90deg)
</style>
