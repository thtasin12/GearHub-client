import { ArrowUpRight } from "lucide-react"

export function StatCard({ label, value, detail, icon: Icon, accent = false }: { label: string; value: string | number; detail?: string; icon: React.ElementType; accent?: boolean }) {
    return (
        <div
            className="surface rounded-2xl p-5"
        >
            <div
                className="flex items-start justify-between"
            >
                <p
                    className="text-xs font-semibold text-muted"
                >
                    {label}
                </p>
                <span
                    className={`grid size-10 place-items-center rounded-xl ${accent ? "bg-[var(--orange-soft)] text-[var(--orange)]" : "bg-[var(--surface-muted)] text-muted"}`}
                >
                    <Icon size={19} />
                </span>
            </div>
            <p
                className="mt-5 text-2xl font-black tracking-tight"
            >
                {value}
            </p>
            <p
                className="mt-1 flex items-center gap-1 text-[11px] text-muted"
            >
                {
                    detail || "Updated from live platform data"
                }
                <ArrowUpRight size={12} />
            </p>
        </div>
    )
}
