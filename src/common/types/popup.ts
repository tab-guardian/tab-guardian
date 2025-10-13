import { EncryptionAlgo, Link } from '@common/types'

type PopupItem<T = any, D = any> = {
    open: boolean
    dataOnOpen: T | null
    dataOnClose: D | null
}

export type EnterPasswordData = {
    decrypting: (password: string) => Promise<boolean>
    algo: EncryptionAlgo | null
}

export type Popups = {
    groupMenuView: PopupItem
    deleteGroup: PopupItem
    groupName: PopupItem
    rebindGroup: PopupItem
    chooseEmoji: PopupItem<null, { emo: string }>
    chooseImageIcon: PopupItem<null, { url: string }>
    newPassword: PopupItem<null, { newPass: string }>
    enterPassword: PopupItem<EnterPasswordData>
    linkMenuView: PopupItem<{ link: Link }>
    newGroupName: PopupItem
    editGroupName: PopupItem
}
