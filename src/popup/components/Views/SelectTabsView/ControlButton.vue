<script setup lang="ts"></script>

<template>
    <a
        href="javascript:"
        :class="[
            'text-private text-sm border border-border px-2 py-1 flex-1',
            'text-center transition-colors rounded-md hover:border-private',
        ]"
    >
        <slot />
    </a>
</template>
