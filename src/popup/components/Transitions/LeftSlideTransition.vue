<template>
    <Transition name="left-slide" appear>
        <slot></slot>
    </Transition>
</template>

<style lang="sass" scoped>
.left-slide-enter-active,
.left-slide-leave-active
    transition: all .2s cubic-bezier(1, 0.5, 0.8, 1)

.left-slide-enter-from,
.left-slide-leave-to
    transform: translateX(100%)

.left-slide-enter-active,
.left-slide-leave-active
    position: absolute
    top: 0
    z-index: 1
</style>
