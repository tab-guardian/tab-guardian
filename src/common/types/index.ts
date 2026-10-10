export type Locale = 'ru' | 'zh_CN' | 'en'

export type LinkBuffer = {
    action: 'copy' | 'cut'
    initialGroupId: number
    link: Link
}

export type ExportFile = {
    meta: {
        schemaVersion: number
        extensionVersion: string
    }
    groups: readonly Group[]
    folders: readonly Folder[]
}

// It used to be that export file could be a group or an array of groups.
// So we should always expect that imported file as LegacyExportFile and
// check for meta.schemaVersion field to prove that it's a new format.
export type LegacyExportFile = Group | Group[] | ExportFile

export type LocaleMessageItem = {
    [key: string]: { message: string }
}

export type PasswordBytes = {
    groupId: number
    bytes: number
}

export type UserChoices = {
    isPrivate: boolean | null
    name: string | null
    closeTabs: boolean | null
    password: string | null
    confirmPassword: string | null
    wantsSelectAllLinks: boolean | null
    bindUrl: string | null
    folderId: number | null
}

export type SelectTabsOperation = 'adding' | 'creating'

export type Link = {
    id: number
    tabId: number
    title: string
    url: string
    favIconUrl: string
    isPinned: boolean
    salt?: string
    iv?: string
}

export type EncryptionAlgo = 'AES-GCM'

export type Folder = {
    id: number
    name: string
    updatedAt: number
}

export type Group = {
    id: number
    folderId?: number
    name: string
    links: Link[]
    isPrivate: boolean
    isEncrypted: boolean
    updatedAt: number
    openedTimes?: number
    createdAt?: number
    hide?: boolean
    /** @deprecated bindURL is deprecated Delete it eventually. Use bindUrl */
    bindURL?: string
    bindUrl?: string
    icon?: string
    algo?: EncryptionAlgo
}

export type Settings = {
    encryptAfterRestore: boolean
    showPrivateGroupsOnlyInIncognito: boolean
    overrideWithSameName: boolean
    showOnlyPrivateGroupsInIncognito: boolean
    rememberPasswordAfterUnlock: boolean
}

export type Attempts = {
    amount: number
    lockEndTime: number
    isLocked: boolean
}
