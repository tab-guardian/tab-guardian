<script setup lang="ts">
import Hamburger from '@/components/Navbar/Sidebar/Hamburger.vue'
</script>

<template>
    <Hamburger />

    <teleport to="body">
        <div class="sidebar">
            Sidebar
        </div>
    </teleport>
</template>

<style scoped lang="sass">
.sidebar
    position: absolute
</style>
