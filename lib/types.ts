export type Role = "customer" | "owner" | "admin"
export type ApiEnvelope<T> = {
    success: boolean
    message?: string
    data: T
    code?: string
}