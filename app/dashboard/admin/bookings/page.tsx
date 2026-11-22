
"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { PageTitle } from "@/components/dashboard/page-title"
import { DataTable } from "@/components/dashboard/data-table"
import { TableCell } from "@/components/dashboard/table-cell"
import { Select } from "@/components/ui/field"
import { StatusBadge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"

import { apiGet, apiPatch } from "@/lib/api"
import type { Booking } from "@/lib/types"
import { formatDate, formatMoney } from "@/lib/utils"

export default function AdminBookingsPage() {
    const [filter, setFilter] = useState("all")

    const qc = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ["admin-bookings", filter],
        queryFn: () =>
            apiGet<Booking[]>(
                `/api/admin/bookings${filter === "all" ? "" : `?status=${filter}`}`,
                true
            )
    })

    async function update(id: string, status: string) {
        try {
            await apiPatch(
                `/api/admin/bookings/${id}/status`,
                { status },
                true
            )

            toast.success("Booking updated")

            qc.invalidateQueries({
                queryKey: ["admin-bookings"]
            })
        } catch (e) {
            toast.error(
                e instanceof Error
                    ? e.message
                    : "Could not update booking"
            )
        }
    }

    return (
        <>
            <PageTitle
                eyebrow="ADMIN"
                title="All rental bookings"
                description="Monitor rental activities, payment states and booking lifecycle across GearHub."
                action={
                    <Select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-44"
                    >
                        <option value="all">All bookings</option>
                        <option value="pending_payment">Pending payment</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_progress">In progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </Select>
                }
            />

            {isLoading ? (
                <div className="h-56 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
            ) : data?.length ? (
                <DataTable
                    columns={[
                        "Customer",
                        "Owner",
                        "Equipment",
                        "Rental period",
                        "Amount",
                        "Payment",
                        "Booking",
                        "Manage"
                    ]}
                >
                    {data.map((b) => (
                        <tr key={b._id}>
                            <TableCell>
                                <p className="font-bold">
                                    {b.customerName}
                                </p>

                                <p className="mt-1 text-[10px] text-muted">
                                    {b.contactNumber || "No contact number"}
                                </p>
                            </TableCell>

                            <TableCell className="text-xs">
                                {b.ownerName}
                            </TableCell>

                            <TableCell className="font-semibold">
                                {b.equipmentName}
                            </TableCell>

                            <TableCell className="text-xs">
                                {formatDate(b.startAt)} – {formatDate(b.endAt)}
                            </TableCell>

                            <TableCell className="font-bold">
                                {formatMoney(
                                    b.totalAmount,
                                    b.currency || "BDT"
                                )}
                            </TableCell>

                            <TableCell>
                                <StatusBadge status={b.paymentStatus} />
                            </TableCell>

                            <TableCell>
                                <StatusBadge status={b.bookingStatus} />
                            </TableCell>

                            <TableCell>
                                <Select
                                    className="w-36 py-2 text-xs"
                                    value={b.bookingStatus}
                                    onChange={(e) => update(b._id, e.target.value)}
                                >
                                    <option value={b.bookingStatus}>
                                        {b.bookingStatus.replaceAll("_", " ")}
                                    </option>

                                    <option value="confirmed">Confirmed</option>
                                    <option value="in_progress">In progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </Select>
                            </TableCell>
                        </tr>
                    ))}
                </DataTable>
            ) : (
                <EmptyState
                    title="No booking records"
                    description="Bookings will appear here as customers rent equipment."
                />
            )}
        </>
    )
}
