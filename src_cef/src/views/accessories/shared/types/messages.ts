export interface MessagePreview {
    Number: number
    Avatar?: string
    Name: string
    Date: string
    Text: string
    Type: number
    IsMe: boolean
    Status: boolean
    IsWrite?: boolean
    DraftText?: string
}

export interface Message {
    Key?: number
    Id?: number
    Text: string
    Date?: string | number
    Me: boolean
    Type: number
    Status: number
}

export interface Contact {
    Name?: string
    Avatar?: string
    IsSystem?: boolean
    Number?: number
}
