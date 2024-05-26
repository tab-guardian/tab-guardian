<script setup lang="ts">
import getImageURL from '@common/modules/getImageURL'
</script>

<template>
    <div class="h-36 bg-slate-500 dark:bg-slate-800 relative overflow-hidden">
        <img
            :src="getImageURL('icons/icon-128.png')"
            class="absolute top-1/2 -translate-y-1/2 -right-12 drop-shadow-md"
        />
    </div>
</template>
