export type Photo = {
    _id?: string
    name: string
    fileName: string
    desc: string
    shootTime?:Date
    uploadedAt?: Date
    width: number,
    height: number
    albumId: string
}
