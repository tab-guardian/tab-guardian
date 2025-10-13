import { EncryptionAlgo, Link } from '@common/types'

type PopupItem<T = any, D = any> = {
    open: boolean
    dataOnOpen: T | null
    dataOnClose: D | null
}

export type EnterPasswordData = {
    decrypting: (password: string) => Promise<boolean>
    algo: EncryptionAlgo | null
    description: string
}

export type Popups = {
    groupMenuView: PopupItem
    deleteGroup: PopupItem
    groupName: PopupItem
    rebindGroup: PopupItem
    chooseEmoji: PopupItem<{}, { emo: string }>
    chooseImageIcon: PopupItem<{}, { url: string }>
    newPassword: PopupItem<{}, { newPass: string }>
    enterPassword: PopupItem<EnterPasswordData>
    linkMenuView: PopupItem<{ link: Link }>
    newGroupName: PopupItem
    editGroupName: PopupItem
}
