import type { Group } from '@/types'
import getFromStorage from '@common/modules/storage/getFromStorage'

export default async (): Promise<Group[]> => {
    const groups = await getFromStorage<Group[]>('groups')

    if (!groups) {
        return []
    }

    const decodedGroups: Group[] = []

    for (let group of groups) {
        const links = group.links.map(link => {
            return {
                ...link,
                favIconUrl: decodeURIComponent(link.favIconUrl),
                url: decodeURIComponent(link.url),
            }
        })

        decodedGroups.push({
            ...group,
            links,
        })
    }

    return decodedGroups
}
