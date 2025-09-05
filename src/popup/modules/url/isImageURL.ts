import { validateImageURL } from "@/modules/url/validateImageURL"

export function isImageURL(url: string | null | undefined): boolean {
    if (!url) {
        return false
    }

    return validateImageURL(url) === null
}
