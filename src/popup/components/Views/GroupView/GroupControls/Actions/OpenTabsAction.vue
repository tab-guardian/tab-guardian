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
    transform: rotate(-90deg)
    background-color: var(--tg-color-green)
</style>
