<script setup lang="ts">
import NavControls from '@/components/Navbar/NavControls.vue'
import Sidebar from '@/components/Navbar/Sidebar/Sidebar.vue'
</script>

<template>
    <nav class="navbar">
        <Sidebar />

        <RouterLink :to="{ name: 'main' }">
            <h1>Tab Guardian</h1>
        </RouterLink>

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
    background-color: var(--tg-color-bg)
    box-shadow: 0 0 4px 5px rgb(0 0 0 / 7%)

    a
        text-decoration: none
        color: var(--tg-color-font)

    h1
        font-size: .9rem
        cursor: pointer
        padding: 6px 4px
        transition: color .2s

        &:hover
            color: var(--tg-color-primary)
</style>
