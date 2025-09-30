<script setup lang="ts">
import Control from '@/components/Control.vue'
import CogIcon from '@common/components/Icons/CogIcon.vue'
import BellIcon from '@common/components/Icons/BellIcon.vue'
import { openSettingsPage } from '@/modules/openSettingsPage'
</script>

<template>
    <div class="flex gap-2 items-center absolute right-2">
        <Control @click="openSettingsPage">
            <BellIcon />
        </Control>

        <Control @click="openSettingsPage">
            <CogIcon />
        </Control>
    </div>
</template>
