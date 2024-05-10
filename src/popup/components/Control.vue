<template>
    <button type="button">
        <slot />
    </button>
</template>

<style lang="sass" scoped>
button
    width: 35px
    height: 35px
    display: flex
    justify-content: center
    align-items: center
    background: transparent
    border: 1px solid transparent
    color: var(--tg-color-font)
    border-radius: 5px
    padding: 6px
    opacity: .8
    transition: opacity .2s, border-color .2s
    cursor: pointer

    &:hover
        opacity: 1
        border-color: var(--tg-color-border)
</style>
