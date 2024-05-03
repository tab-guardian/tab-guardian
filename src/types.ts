export enum ScreenName {
    Main = 'main',
    Group = 'group',
    Settings = 'settings',
}

export type Messages = {
    [key: string]: {
        [key: string]: string
    }
}

export type Link = {
    id: number
    title: string
    url: string
    iconUrl: string
}

export type Group = {
    id: number
    title: string
    links: Link[]
    isPrivate: boolean
}

export type SaveGroupParams = {
    title?: string
    isPrivate?: boolean
}
