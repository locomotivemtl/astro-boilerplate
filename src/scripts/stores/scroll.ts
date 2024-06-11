import { map } from 'nanostores'

export interface IScrollValues {
    scroll: number
    limit: number
    velocity: number
    direction: number
    progress: number
}

export const $scroll = map<IScrollValues>({
    scroll: window.scrollY,
    limit: 0,
    velocity: 0,
    direction: 0,
    progress: 0
})
