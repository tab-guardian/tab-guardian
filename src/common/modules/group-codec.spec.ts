import { describe, it, expect, suite } from 'vitest'
import { fakeGroup, fakeLink, fakeLinks } from '@common/modules/fake'
import { decodeGroup, encodeGroup } from '@common/modules/group-codec'

describe('group codec', () => {
    suite('encodeGroup()', () => {
        it('encodes link url and favIconUrl', () => {
            const link = fakeLink({
                url: 'https://site.com/a path?q=1&b=2',
                favIconUrl: 'https://site.com/icon.png',
            })

            const group = encodeGroup(fakeGroup({ links: [link] }))
            const encoded = group.links[0]

            expect(encoded.url).equal(encodeURIComponent(link.url))
            expect(encoded.favIconUrl).equal(encodeURIComponent(link.favIconUrl))
        })

        it('keeps other link fields untouched', () => {
            const link = fakeLink({ title: 'A title', isPinned: true })

            const group = encodeGroup(fakeGroup({ links: [link] }))
            const encoded = group.links[0]

            expect(encoded.title).equal('A title')
            expect(encoded.isPinned).equal(true)
            expect(encoded.id).equal(link.id)
        })

        it('does not mutate the original group', () => {
            const link = fakeLink()
            const group = fakeGroup({ links: [link] })

            const encoded = encodeGroup(group)

            expect(group.links[0].url).equal(link.url)
            expect(encoded).not.toBe(group)
            expect(encoded.links[0]).not.toBe(link)
        })
    })

    suite('decodeGroup()', () => {
        it('decodes link url and favIconUrl', () => {
            const link = fakeLink({
                url: 'https://site.com/a path?q=1&b=2',
                favIconUrl: 'https://site.com/icon.png',
            })

            const encodedLink = {
                ...link,
                url: encodeURIComponent(link.url),
                favIconUrl: encodeURIComponent(link.favIconUrl),
            }

            const group = decodeGroup(fakeGroup({ links: [encodedLink] }))

            expect(group.links[0].url).equal(link.url)
            expect(group.links[0].favIconUrl).equal(link.favIconUrl)
        })

        it('round-trips a group through encode and decode', () => {
            const group = fakeGroup({ links: fakeLinks(2) })
            expect(decodeGroup(encodeGroup(group))).toEqual(group)
        })

        it('maps the legacy bindURL field to bindUrl and drops bindURL', () => {
            const group = fakeGroup({ bindURL: 'https://site.com/page' })

            const decoded = decodeGroup(group)

            expect(decoded.bindUrl).equal('https://site.com/page')
            expect(decoded.bindURL).toBeUndefined()
        })

        it('keeps bindUrl unchanged when there is no legacy field', () => {
            const group = fakeGroup({ bindUrl: 'https://site.com/page' })

            const decoded = decodeGroup(group)

            expect(decoded.bindUrl).equal('https://site.com/page')
            expect(decoded.bindURL).toBeUndefined()
        })

        it('does not mutate the original group', () => {
            const link = fakeLink({
                url: encodeURIComponent('https://site.com/a'),
            })

            const group = fakeGroup({ links: [link], bindURL: 'https://a.com' })

            decodeGroup(group)

            expect(group.links[0].url).equal(link.url)
            expect(group.bindURL).equal('https://a.com')
        })
    })
})
