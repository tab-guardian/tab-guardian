<script setup lang="ts">
import CloseIcon from '@common/components/Icons/CloseIcon.vue'
</script>

<template>
    <div class="absolute inset-0 bg-black/80 cursor-pointer z-20 group/close-icon">
        <CloseIcon
            :class="[
                'w-8 h-8 absolute right-5 top-2 bg-black/70 rounded-full p-1.5',
                'transition-colors group-hover/close-icon:bg-red-600 stroke-white',
            ]"
        />
    </div>
</template>
