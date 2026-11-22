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
export type Pagination = { 
    page: number
    limit: number
    total: number 
    totalPages: number 
}

export type PageResult<T> = { 
    items: T[]
    pagination: Pagination 
}

export type Payment = { 
    _id: string 
    stripeSessionId?: string
    amount: number
    currency: string
    status: string
    purpose?: string
    createdAt: string 
}

export type Booking = {
  _id: string
  equipmentId: string
  equipmentName: string
  equipmentImage: string
  customerName: string
  ownerName: string
  startAt: string
  endAt: string
  requiredQuantity: number
  totalAmount: number
  currency?: string
  paymentStatus: string
  bookingStatus: string
  durationDays?: number
  rentalType?: string
  createdAt: string
  contactNumber?: string
  deliveryAddress?: string
  additionalNotes?: string
  payments?: Payment[]
}