export interface IDeviceStore {
    currentPage: string
    selectNumber: number | null
    selectedImage: boolean
    selectedImageFunc: ((link: string) => void) | false
    wallpaper: string
    radioState: boolean
    radioStation: number
    setPage(page: string): void
    pageBack(): void
    reset(): void
    initGroup(): void
}
