import { Link } from '@common/types'

type PopupItem<T = any, D = any> = {
    open: boolean
    dataOnOpen: T | null
    dataOnClose: D | null
    onClose: ((data: D) => void) | null
}

export type EnterPasswordData = {
    decrypting: (password: string) => Promise<boolean>
    text: string
}

export type ConfirmData = {
    text: string
}

export type Popups = {
    groupMenuView: PopupItem
    confirm: PopupItem<ConfirmData, { isConfirmed: boolean }>
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
