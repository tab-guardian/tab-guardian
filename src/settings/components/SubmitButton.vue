<script setup lang="ts">
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

type Props = {
    title: string
}

const { title } = defineProps<Props>()
</script>

<template>
    <div class="field is-grouped is-grouped-right">
        <div class="control">
            <button type="submit" class="button is-link">
                <CheckIcon width="19" height="19" class="mr-2" />
                {{ title }}
            </button>
        </div>
    </div>
</template>
