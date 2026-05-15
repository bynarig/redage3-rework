export type TinderView = 'Profile' | 'List' | 'Matches'

export interface TinderProfile {
    avatar?: string
    text?: string
    type?: number
    isVisible?: number
}

export interface TinderUser {
    uuid: string
    name: string
    avatar?: string
    text?: string
}
