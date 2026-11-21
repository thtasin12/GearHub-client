export { cn } from "cn"

export function formatMoney(amount: number, currency = "BDT") {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
    }).format(Number(amount || 0))
}