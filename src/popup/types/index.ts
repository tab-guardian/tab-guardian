export type Messages = {
    [key: string]: {
        [key: string]: string
    }
}

export type Link = {
    id: number
    title: string
    url: string
    favIconUrl: string
}

export type Group = {
    id: number
    name: string
    links: Link[]
    isPrivate: boolean
    isEncrypted: boolean
}

export type Settings = {
    password: string
}

export type Popups = {
    groupView: boolean
    deleteGroup: boolean
    groupName: boolean
}

export type Modals = {
    settings: boolean
    group: boolean
    selectTabs: boolean
}
