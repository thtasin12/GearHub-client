export { cn } from "cn"

export function formatMoney(amount: number, currency = "BDT") {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
    }).format(Number(amount || 0))
}

export function makeQuery(params: Record<string, string | number | boolean | undefined | null>) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.set(key, String(value))
        }
    })
    return query.toString()
}

export function formatDate(value?: string | Date, options?: Intl.DateTimeFormatOptions) {
    if (!value) return "—"
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-BD", options ?? { day: "numeric", month: "short", year: "numeric" }).format(date)
}

export function initials(name?: string) { 
    return (name || "GearHub").split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("")
}

export function titleCase(value = "") { 
    return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}