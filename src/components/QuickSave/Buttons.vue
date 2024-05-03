<script setup lang="ts">
import { useGroupStore } from '@/stores/groupStore'
import { useTransStore } from '@/stores/transStore'
import ShieldCheckIcon from '@/components/Icons/ShieldCheckIcon.vue'

const { trans } = useTransStore()
const { saveGroup } = useGroupStore()
</script>

<template>
    <div class="buttons">
        <button @click="saveGroup" class="btn save" type="button">
            {{ trans('Quick Save') }}
        </button>

        <button
            @click="saveGroup({ isPrivate: true })"
            class="btn save-private"
            type="button"
        >
            <ShieldCheckIcon />
        </button>
    </div>
</template>

<style lang="sass" scoped>
.buttons
    display: flex
    align-items: center
    border: 1px solid var(--dark-blue)
    border-radius: 50px

    .btn
        height: 37px
        border: none
        font-size: 16px
        display: flex
        align-items: center
        justify-content: center
        color: white
        cursor: pointer

    .save
        width: 100%
        border-radius: 50px 0 0 50px
        background-color: rgb(0 227 255 / 10%)
        transition: background-color .2s

        &:hover
            background-color: rgb(0 227 255 / 15%)

    .save-private
        width: 60px
        border-radius: 0 50px 50px 0
        background-color: var(--dark-blue)
        transition: background-color .2s, box-shadow .2s

        &:hover
            background-color: var(--dark-blue-hover)
            box-shadow: 0 0 20px 6px var(--dark-blue)

            svg
                transform: scale(1.1)

        svg
            width: 25px
            height: 25px
            transition: transform .2s
</style>