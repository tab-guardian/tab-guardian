<script setup lang="ts">
import { ref } from 'vue'

const count = ref<number>(0)
</script>

<template>
    <div>
        <div>
            <button @click="count += 1">{{ count }}</button>
        </div>

        <span>Here</span>
    </div>
</template>