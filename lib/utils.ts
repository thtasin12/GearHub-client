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
