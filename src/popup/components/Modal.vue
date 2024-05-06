<template>
    <div class="modal">
        <slot></slot>
    </div>
</template>

<style lang="sass" scoped>
.modal
    position: absolute
    top: 0
    bottom: 0
    right: 0
    left: 0
    background-color: var(--tg-color-light)
    padding: var(--tg-padding)
</style>