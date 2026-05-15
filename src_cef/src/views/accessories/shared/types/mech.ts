import type { Position } from './position'

export type MechView = 'List' | 'Client' | 'Driver'

export interface MechOrder {
    isOrder?: boolean
    pos?: Position
    driver?: string
    number?: string
}

export interface MechJobOrder {
    id: number
    area: string
    dist: number
    name: string
}

export interface MechDriverSelect {
    name?: string
    pos?: Position
    uid?: number
    aStreet?: string
    aArea?: string
}
