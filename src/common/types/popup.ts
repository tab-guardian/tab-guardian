import { Link } from '@common/types'

type PopupItem<T = any, D = any> = {
    open: boolean
    dataOnOpen: T | null
    dataOnClose: D | null
    onClose: ((data: D) => void) | null
}

type EnterPasswordData = {
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
    enterPassword: PopupItem<EnterPasswordData>
    linkMenuView: PopupItem<{ link: Link }>
    editGroupName: PopupItem
}
