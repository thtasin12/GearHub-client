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

export type Equipment = {
    _id: string
    name: string
    description: string
    category: string
    location: {
        city: string
        address: string
        country?: string
    }
    rentalPrice: number
    rentalType: "daily" | "weekly" | "monthly"
    availableQuantity: number
    condition: string
    brand?: string
    model?: string
    image: string
    rentalTerms?: string
    gallery?: string[]
    averageRating?: number
    reviewCount?: number
    status?: string
    ownerName?: string
    ownerId?: string
    totalRentals?: number
    remaining?: number
    reserved?: number
    owner?: {
        name?: string
        image?: string
        email?: string
        memberSince?: string
    } | null
    reviews?: Review[]
}

export type Review = {
    _id?: string
    customerName: string
    rating: number
    comment: string
    createdAt: string
}