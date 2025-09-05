import emojiRegex from 'emoji-regex'

export function isEmoji(emoji: string): boolean {
    const regex = emojiRegex()
    const matches = [...emoji.matchAll(regex)]

    // Ensure exactly one match, and no other characters
    return matches.length === 1 && matches[0][0] === emoji.trim()
}
