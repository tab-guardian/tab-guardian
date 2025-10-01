<script setup lang="ts">
import { trans } from '@common/modules/trans'
import NavControls from '@/components/Navbar/NavControls.vue'
import Sidebar from '@/components/Navbar/Sidebar/Sidebar.vue'
</script>

<template>
    <nav class="h-9 flex items-center justify-center bg-secondary shadow-md py-1 px-2 relative">
        <Sidebar />

        <RouterLink
            :to="{ name: 'main' }"
            class="block transition-colors hover:bg-secondary-hover px-3 rounded-md text-md"
        >
            {{ trans('ext_name') }}
        </RouterLink>

        <NavControls />
    </nav>
</template>
