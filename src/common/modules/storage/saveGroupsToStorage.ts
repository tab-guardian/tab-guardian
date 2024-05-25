import type { Group, Link } from '@/types'
import saveToStorage from '@common/modules/storage/saveToStorage'

export default async (groups: Group[]): Promise<void> => {
    const encodedGroups: Group[] = []

    for (let group of groups) {
        const links: Link[] = group.links.map(link => {
            return {
                ...link,
                favIconUrl: encodeURIComponent(link.favIconUrl),
                url: encodeURIComponent(link.url),
            }
        })

        encodedGroups.push({
            ...group,
            links,
        })
    }

    for (let i = 0; i < encodedGroups.length; i++) {
        await saveToStorage<Group>(`group_${i}`, encodedGroups[i])
    }
}
