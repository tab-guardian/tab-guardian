<script setup lang="ts">
import NavControls from '@/components/Navbar/NavControls.vue'
</script>

<template>
    <nav class="navbar">
        <h1>Tab Guardian</h1>

        <NavControls />
    </nav>
</template>

<style lang="sass" scoped>
.navbar
    display: flex
    justify-content: space-between
    align-items: center
    height: 40px
    padding: 3px 10px
    background-color: var(--tg-color-bg-light)
    box-shadow: 0 0 4px 5px rgba(0, 0, 0, .07)

    h1
        font-size: 1rem
</style>