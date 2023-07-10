import Promise from 'promise'

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
