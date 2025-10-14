import { readonly, ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useProgressStore = defineStore('progress', () => {
    const max = ref<number>(0)
    const current = ref<number>(0)

    const loading = computed<boolean>(() => {
        return max.value > 0 && current.value < max.value
    })

    function finish(): void {
        max.value = 0
        current.value = 0
    }

    function start(barLength: number): void {
        max.value = barLength
    }

    function advance(): void {
        current.value++
    }

    return {
        max: readonly(max),
        current: readonly(current),
        loading,
        finish,
        start,
        advance,
    }
})
