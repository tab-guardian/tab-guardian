<template>
    <Transition
        enter-active-class="transition-opacity duration-200 ease"
        leave-active-class="transition-opacity duration-200 ease"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
    >
        <slot />
    </Transition>
</template>
