import type { Position } from './position'

export type TaxiView = 'List' | 'Client' | 'Driver'

export interface TaxiOrder {
    isOrder?: boolean
    pos?: Position
    driver?: string
    number?: string
}

export interface TaxiJobOrder {
    id: number
    area: string
    dist: number
    name: string
}

export interface TaxiDriverSelect {
    name?: string
    pos?: Position
    aStreet?: string
    aArea?: string
}
