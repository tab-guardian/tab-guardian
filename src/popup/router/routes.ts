import MainView from '@/components/Views/MainView/MainView.vue'
import GroupView from '@/components/Views/GroupView/GroupView.vue'
import SelectTabsView from '@/components/Views/SelectTabsView/SelectTabsView.vue'
import GroupIconView from '@/components/Views/SetIconView/GroupIconView.vue'
import GroupInfoView from '@/components/Views/GroupInfoView/GroupInfoView.vue'

export default [
    { path: '/', name: 'main', component: MainView },
    { path: '/group/:id/:openTabs?', name: 'group', component: GroupView },
    { path: '/group-icon/:id', name: 'groupIcon', component: GroupIconView },
    { path: '/group-info/:id', name: 'groupInfo', component: GroupInfoView },
    {
        path: '/select-tabs',
        name: 'select-tabs',
        component: SelectTabsView,
    },
]
