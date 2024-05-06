<template>
    <transition name="right-slide" appear>
        <slot></slot>
    </transition>
</template>

<style lang="sass" scoped>
.right-slide-enter-active,
.right-slide-leave-active
    transition: all .2s cubic-bezier(1, 0.5, 0.8, 1)

.right-slide-enter-from,
.right-slide-leave-to
    transform: translateX(-100%)

.right-slide-leave-active,
.right-slide-enter-active
    position: absolute
    top: 0
    z-index: 1
</style>
