import type { BackendEventMessage, FrontendEventMessage } from '@common/types'
import { isRuntime } from '@common/modules/runtime/utils'

const target = isRuntime('firefox') ? browser : chrome

const sendEventMessageCallback = isRuntime('firefox')
    ? browser.runtime.sendMessage
    : chrome.runtime.sendMessage

export async function sendEventMessage(message: BackendEventMessage): Promise<void> {
    await sendEventMessageCallback(message)
}

export async function listenEventMessage(
    callback: (message: FrontendEventMessage) => void,
): Promise<void> {
    target.runtime.onMessage.addListener(callback)
}
