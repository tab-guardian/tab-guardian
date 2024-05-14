import MainView from '@/components/Views/MainView/MainView.vue'
import SettingsView from '@/components/Views/SettingsView/SettingsView.vue'
import GroupView from '@/components/Views/GroupView/GroupView.vue'
import SelectTabsView from '@/components/Views/SelectTabsView/SelectTabsView.vue'

export default [
    { path: '/', name: 'main', component: MainView },
    { path: '/settings', name: 'settings', component: SettingsView },
    { path: '/group/:id', name: 'group', component: GroupView },
    {
        path: '/select-tabs',
        name: 'select-tabs',
        component: SelectTabsView,
    },
]
