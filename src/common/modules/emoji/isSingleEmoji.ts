import emojiRegex from 'emoji-regex'

export function isSingleEmoji(inp: string): boolean {
    const regex = emojiRegex()
    const matches = [...inp.matchAll(regex)]

    // Ensure exactly one match, and no other characters
    return matches.length === 1 && matches[0][0] === inp.trim()
}
