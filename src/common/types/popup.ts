import { Link } from '@common/types'

type PopupItem<T = any, D = any> = {
    open: boolean
    dataOnOpen: T | null
    dataOnClose: D | null
    onClose: ((data: D) => void) | null
}

type PasswordData = {
    decrypting: (password: string) => Promise<boolean>
    text: string
}

export type Popups = {
    groupMenuView: PopupItem
    confirm: PopupItem<{ text: string }, { isConfirmed: boolean }>
    groupName: PopupItem
    bindGroup: PopupItem
    chooseEmoji: PopupItem<{}, { emo: string }>
    chooseImageIcon: PopupItem<{}, { url: string }>
    newPassword: PopupItem<{}, { newPass: string }>
    password: PopupItem<PasswordData>
    linkMenuView: PopupItem<{ link: Link }>
    editGroupName: PopupItem
}
