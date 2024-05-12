<script setup lang="ts">
import Control from '@/components/Control.vue'
import CogIcon from '@/components/Icons/CogIcon.vue'
</script>

<template>
    <div class="controls">
        <Control :to="{ name: 'settings' }">
            <CogIcon />
        </Control>
    </div>
</template>

<style scoped lang="sass">
.controls
    display: flex
    align-items: center
</style>
