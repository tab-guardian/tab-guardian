<script setup lang="ts">
import { ref } from 'vue'

const counter = ref<number>(0)
</script>

<template>
    <h1>Count: {{ counter }}</h1>
    <button @click="counter++">Increment</button>
</template>

<style scoped lang="sass">
h1
    color: red
</style>