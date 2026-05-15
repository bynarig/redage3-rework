export type PropertyView = 'List' | 'House' | 'Business'

export interface PropertyItem {
    id: number
    type: number
    isOwner?: boolean
    name?: string
    address?: string
}
