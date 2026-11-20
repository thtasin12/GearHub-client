export type Role = "customer" | "owner" | "admin"
export type ApiEnvelope<T> = {
    success: boolean
    message?: string
    data: T
    code?: string
}

export type UserProfile = {
    _id?: string
    id?: string
    name: string
    email: string
    image?: string
    role: Role
    phone?: string
    address?: string
    createdAt?: string
}