import type { Position } from './position'

export interface TruckerSelect {
    uid?: number
    name?: string
    pos?: Position
    aStreet?: string
    aArea?: string
}

export interface TruckerOrder {
    id: number
    area: string
    dist: number
    name: string
}
