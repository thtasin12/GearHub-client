import type { ReactNode } from "react"

export function DataTable({ columns, children, empty = "No records found." }: { columns: string[]; children: ReactNode; empty?: string }) {
    return (
        <div
            className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
        >
            <div
                className="overflow-x-auto"
            >
                <table
                    className="w-full min-w-[700px] text-left text-sm"
                >
                    <thead
                        className="bg-[var(--surface-muted)] text-[10px] font-bold uppercase tracking-wider text-muted"
                    >
                        <tr>
                            {
                                columns.map(c => <th
                                    key={c}
                                    className="px-5 py-4"
                                >
                                    {c}
                                </th>
                                )
                            }
                        </tr>
                    </thead>
                    <tbody
                        className="divide-y divide-[var(--border)]"
                    >
                        {children}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
