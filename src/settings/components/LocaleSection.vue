<script setup lang="ts">
import { useTransStore } from '@/stores/trans'
import showToast from '@common/modules/showToast'
import Section from '@settings/components/Section.vue'
import { languages } from '@/stores/trans'

const { lang, trans, changeLang } = useTransStore()
</script>

<template>
    <Section
        :title="trans('Change Language')"
        :subtitle="trans('Change the extension interface language')"
    >
        <div class="flex gap-2 flex-wrap">
            <label
                v-for="l in languages"
                :key="l.code"
                :class="[
                    'inline-flex items-center gap-2 border border-border px-3 py-1 rounded-md',
                    'cursor-pointer',
                    lang === l.code
                        ? 'bg-primary text-page'
                        : 'hover:border-primary',
                ]"
            >
                <input
                    type="radio"
                    :id="l.code"
                    :value="l.code"
                    class="hidden"
                    name="locale"
                    v-model="lang"
                    @change="changeLang(l.code)"
                />

                <span>{{ l.flag }}</span>
                <span>{{ l.name }}</span>
            </label>
        </div>
    </Section>
</template>
