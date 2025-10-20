<template>
    <a
        href="javascript:"
        :class="[
            'text-success text-sm border border-border px-2 py-1 flex-1',
            'text-center transition-colors rounded-md hover:border-success',
        ]"
    >
        <slot />
    </a>
</template>
