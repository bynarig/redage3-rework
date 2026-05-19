export interface RecentCall {
    Number: number
    Name: string
    time: string
    isCall: boolean
}

export interface CallInfo {
    Name?: string
    Number?: number
    Avatar?: string
    isComing?: boolean
    isCall?: boolean
}

export interface ContactItem {
    Number: number
    Name: string
    Avatar?: string
    IsSystem?: boolean
    IsAdded?: boolean
    IsBlackList?: boolean
    IsNotShow?: boolean
}

export interface ContactGroup {
    Name: string
    List: ContactItem[]
}
