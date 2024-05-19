<script setup lang="ts">
import Control from '@/components/Control.vue'
import CogIcon from '@common/components/Icons/CogIcon.vue'
import openSettingsPage from '@/modules/openSettingsPage'
</script>

<template>
    <div class="flex items-center">
        <Control @click="openSettingsPage(true)">
            <CogIcon />
        </Control>
    </div>
</template>
