<template>
    <button
        :class="[
            'border border-border rounded-md px-5 py-1 bg-primary',
            'text-page transition-shadow inline-flex items-center gap-2',
            'opacity-90 hover:border-border-hover hover:opacity-100 text-page',
        ]"
    >
        <slot />
    </button>
</template>
