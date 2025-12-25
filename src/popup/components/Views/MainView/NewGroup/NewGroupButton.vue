<script setup lang="ts"></script>

<template>
    <button
        type="button"
        :class="[
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'h-10 flex items-center justify-center gap-2 rounded-lg',
            'text-page transition cursor-pointer border-2 border-border',
        ]"
    >
        <slot />
    </button>
</template>
