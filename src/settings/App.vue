<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useAttemptsStore } from '@/stores/attempts'
import Spinner from '@common/components/Spinner.vue'
import SettingsSidebar from '@settings/components/SettingsSidebar.vue'
import ConfirmModal from '@/components/Modals/ConfirmModal.vue'
import Modals from '@/components/Modals/Modals.vue'
import NewPasswordModal from '@/components/Modals/NewPasswordModal.vue'
import PasswordModal from '@/components/Modals/PasswordModal.vue'
import RemoveUrlLockModal from '@/components/Modals/Group/RemoveUrlLockModal.vue'

const settingsStore = useSettingsStore()

onMounted(async () => {
    await settingsStore.load()
    await useAttemptsStore().load()
})
</script>

<template>
    <div class="max-w-[1000px] mx-3 md:mx-auto">
        <Spinner v-if="settingsStore.loading" />

        <div v-else class="grid grid-cols-1 md:grid-cols-[220px_3fr] mt-3">
            <SettingsSidebar />
            <div class="bg-page border border-border p-5 rounded-xl">
                <RouterView />
            </div>
        </div>
    </div>

    <Modals
        :modals="[
            { comp: RemoveUrlLockModal, name: 'removeUrlLock' },
            { comp: NewPasswordModal, name: 'newPassword' },
            { comp: PasswordModal, name: 'password' },
            { comp: ConfirmModal, name: 'confirm' },
        ]"
    />
</template>
