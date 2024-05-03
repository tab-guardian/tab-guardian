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
}
