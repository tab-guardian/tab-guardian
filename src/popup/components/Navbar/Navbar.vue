<script setup lang="ts">
import NavControls from '@/components/Navbar/NavControls.vue'
import Sidebar from '@/components/Navbar/Sidebar/Sidebar.vue'
</script>

<template>
    <nav
        :class="[
            'flex justify-between align-center h-9 bg-secondary',
            'shadow-md py-1 px-2',
        ]"
    >
        <Sidebar />

        <RouterLink
            :to="{ name: 'main' }"
            class="flex items-center transition-colors hover:bg-black/10 px-3 rounded-md text-md"
        >
            Tab Guardian
        </RouterLink>

        <NavControls />
    </nav>
</template>
