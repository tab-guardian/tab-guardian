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
    title: string
    links: Link[]
    isPrivate: boolean
}

export type SaveGroupParams = {
    title?: string
    isPrivate?: boolean
}


export type Settings = {
    password: string
}