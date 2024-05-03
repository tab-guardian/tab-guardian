<script setup lang="ts">
import QuickSave from '@/components/QuickSave/QuickSave.vue'
import Groups from '@/components/Groups/Groups.vue'
</script>

<template>
    <QuickSave />
    <Groups />
</template>

<style lang="sass">
:root
    --dark-blue: #136881
    --dark-blue-hover: #18748f
    --transparent-blue: rgb(0 227 255 / 10%)
    --transparent-blue-hover: rgb(0 227 255 / 15%)

body
    background: #333
    color: #eee
    width: 330px
    font-family: 'Arial', sans-serif
</style>