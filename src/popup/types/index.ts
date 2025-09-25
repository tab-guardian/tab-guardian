export type UserChoices = {
    isPrivate: boolean | null
    name: string | null
    links: Link[] | null
    closeTabs: boolean | null
    password: string | null
    confirmPassword: string | null
    selectedTabsIds: number[] | null
}
export type Link = {
    id: number
    title: string
    url: string
    favIconUrl: string
    isPinned: boolean
    salt?: string
    iv?: string
}

export type EncryptionAlgo = 'AES-GCM'

export type Group = {
    id: number
    name: string
    links: Link[]
    isPrivate: boolean
    isEncrypted: boolean
    updatedAt: number
    openedTimes?: number
    createdAt?: number
    hide?: boolean
    bindURL?: string
    icon?: string
    algo?: EncryptionAlgo
}

export type Settings = {
    encryptAfterRestore: boolean
    showPrivateGroupsOnlyInIncognito: boolean
    overrideWithSameName: boolean
    showOnlyPrivateGroupsInIncognito: boolean
}

type PopupItem = {
    open: boolean
    data: any
}

export type Popups = {
    groupMenuView: PopupItem
    deleteGroup: PopupItem
    groupName: PopupItem
    rebindGroup: PopupItem
    chooseEmoji: PopupItem
    chooseImageIcon: PopupItem
    newPassword: PopupItem
    linkMenuView: PopupItem
    newGroupName: PopupItem
}

export type Modals = {
    settings: boolean
    group: boolean
    selectTabs: boolean
}

export type Attempts = {
    amount: number
    lockEndTime: null | number
    isLocked: boolean
}
