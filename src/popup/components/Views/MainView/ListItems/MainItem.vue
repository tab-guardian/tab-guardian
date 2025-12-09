<template>
    <div
        :class="[
            'p-2 flex justify-between items-center gap-3',
            'transition-colors border-b border-border',
            'cursor-pointer bg-page hover:bg-page-hover',
        ]"
    >
        <slot />
    </div>
</template>
