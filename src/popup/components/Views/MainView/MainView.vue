<script setup lang="ts">
import Groups from '@/components/Views/MainView/Groups/Groups.vue'
import Buttons from '@/components/Views/MainView/NewGroup/Buttons.vue'
import GroupSearch from '@/components/Views/MainView/NewGroup/GroupSearch.vue'
</script>

<template>
    <div>
        <div class="text-center p-2 border-b border-border">
            <Buttons />
            <GroupSearch />
        </div>

        <Groups />
    </div>
</template>
