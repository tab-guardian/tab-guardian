<template>
    <Transition
        enter-active-class="top-0 transition-all duration-200 ease-in-out"
        leave-active-class="top-0 transition-all duration-200 ease-in-out"
        enter-from-class="-translate-x-full"
        leave-to-class="-translate-x-full"
    >
        <slot></slot>
    </Transition>
</template>
