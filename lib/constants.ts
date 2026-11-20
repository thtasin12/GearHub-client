import { SquareLetterG } from "lucide-react"
import { imageConfigDefault } from "next/dist/shared/lib/image-config"

export const APP_NAME = "GearHub"
export const API_URL = ""
export const APP_URL = process.env.NEXT_PUBLIC_APP || "http://localhost:3000"

export const CATEGORIES = [
    {
        name: "Construction Equipment",
        slug: "construction",
        count: "1.2k+",
        icon: "construction",
        image: "/images/photo.avif"
    },
    {
        name: "Photography Equipment",
        slug: "Photography",
        count: "840+",
        icon: "camera",
        image: "/images/photography-equipment.avif"
    },
    {
        name: "Vehicles & Transportation",
        slug: "Vehicles",
        count: "620+",
        icon: "truck",
        image: "/images/vehicles.avif"
    },
    {
        name: "Electronics",
        slug: "electronics",
        count: "970+",
        icon: "cpu",
        image: "/images/more-items.avif"
    }
] as const 

export const NAV_LINKS = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "Explore equipment",
        href: "/equipment",
    },
    {
        label: "How it works",
        href: "/#how-it-works",
    },
    {
        label: "For owners",
        href: "/#owners",
    }
]

export const CURRENCY = "BDT"
export const DEMO_EQUIPMENT = [
    {
        _id: "demo-excavator",
        name: "CAT 320 Hydraulic Excavator",
        category: "Construction Equipment",
        description: "High-performance excavator for demanding construction sites.",
        rentalPrice: 18500,
        rentalType: "daily",
        availableQuantity: 2,
        condition: "Like New",
        brand: "Caterpillar",
        model: "320D",
        images: "/images/demo-equipment",
        location: {
            city: "Dhaka",
            address: "Uttara, Dhaka",
            country: "Bangladesh",

        },
        averageRating: "4.9",
        reviewCount: 28,
        status: "approved",
        ownerName: "BuildPro Rentals",
        totalRentals: "56"
    },
    {
        _id: "demo-camera",
        name: "Sony A7 IV Cinema Kit",
        category: "Photography Equipment",
        description: "Professional full-frame camera kit for commercial production.",
        rentalPrice: 5500, 
        rentalType: "daily",
        availableQuantity: 4, 
        condition: "Excellent",
        brand: "Sony",
        model: "A7 IV",
        images: "/images/photography-equipment.avif",
        location: {
            city: "Dhanmondi",
            address: "Dhanmondi, Dhaka",
            country: "Bangladesh",
        },
        averageRating: 4.8,
        reviewCount: 19,
        status: "approved",
        ownerName: "Frame Factory",
        totalRentals: 41
    },
    {
        _id: "demo-generator",
        name: "Perkins 30kVA Generator",
        category: "Electronics",
        description: "Reliable backup power for events and construction projects.",
        rentalPrice: 3200,
        rentalType: "daily",
        availableQuantity: 3,
        condition : "Good",
        brand: "Perkins",
        model: "30kVA",
        image: "/images/generator.avif",
        location: {
            city: "Gazipur",
            address: "Tongi, Gaziput",
            country: "Bangladesh"
        },
        averageRating: "4.7",
        reviewCount: 14,
        status: "approved",
        ownerName: "PowerHub",
        totalRentals: 22
    },
    {
        _id: "demo-lift",
        name: "Articulating Boom Lift 45ft",
        category: "Construction Equipment",
        description: "Reach elevated work areas with stable, safe access.",
        rentalPrice: 9800,
        rentalType: "daily",
        availableQuantity: 1,
        condition : "Like New",
        brand: "JLG",
        model: "450AJ",
        image: "/images/generator.avif",
        location: {
            city: "Gazipur",
            address: "Tongi, Gaziput",
            country: "Bangladesh"
        },
        averageRating: "4.9",
        reviewCount: 12,
        status: "approved",
        ownerName: "SkyReach LTD.",
        totalRentals: 18
    },
    {
        _id: "demo-drone",
        name: "DJI Mavic 3 Pro Creator Combo",
        category: "Photography Equipment",
        description: "Triple-camera drone for cinematic aerial production.",
        rentalPrice: 4200,
        rentalType: "daily",
        brand: "DJI",
        model: "Mavic 3 Pro",
        image: "/images/demo-drone.avif",
        location: {
            city: "Banani",
            address: "Banani, Dhaka",
            country: "Bangladesh"
        },
        averageRating: 5,
        reviewCount: 9,
        status: "approved",
        ownerName: "Aerial Studio",
        totalRentals: 17
    },
    {
        _id: "demo-tractor",
        name: "John Deere 5050D Tractor for field operations and farm transport.",
        rentalPrice: 6500,
        rentalType: "daily",
        availableQuantity: 2,
        condition: "Good",
        brand: "John Deere",
        model: "5050D",
        image: "images/demo-tractor.avif",
        location: {
            city: "Meymensingh",
            address: "Sadar, Meymensingh",
            country: "Bangladesh"
        },
        averageRating: "4.6",
        reviewCount: 11,
        status: "approved",
        ownerName: "Agriculture Works",
        totalRentals: 13
    }
 
] as const