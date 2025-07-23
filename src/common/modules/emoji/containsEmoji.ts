export function containsEmoji(inp: string): boolean {
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu
    return emojiRegex.test(inp)
}
