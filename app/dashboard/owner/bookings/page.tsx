
"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { PageTitle } from "@/components/dashboard/page-title"
import { DataTable } from "@/components/dashboard/data-table"
import { TableCell } from "@/components/dashboard/table-cell"
import { StatusBadge } from "@/components/ui/badge"
import { Select } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"

import { apiGet, apiPatch } from "@/lib/api"
import type { Booking } from "@/lib/types"
import { formatDate, formatMoney } from "@/lib/utils"

export default function OwnerBookingsPage() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["owner-bookings"],
    queryFn: () =>
      apiGet<{
        items: Booking[]
        pagination: unknown
      }>("/api/owner/bookings?page=1&limit=100", true)
  })

  async function update(id: string, status: string) {
    try {
      await apiPatch(
        `/api/owner/bookings/${id}/status`,
        { status },
        true
      )

      toast.success("Booking status updated")

      qc.invalidateQueries({
        queryKey: ["owner-bookings"]
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
        eyebrow="OWNER"
        title="Rental requests"
        description="Review customer requests and update each paid rental as it moves through the process."
      />

      {isLoading ? (
        <div className="h-56 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
      ) : data?.items.length ? (
        <DataTable
          columns={[
            "Customer",
            "Equipment",
            "Rental period",
            "Amount",
            "Payment",
            "Booking status",
            "Activity"
          ]}
        >
          {data.items.map((b) => (
            <tr key={b._id}>
              <TableCell>
                <p className="font-bold">
                  {b.customerName}
                </p>

                <p className="mt-1 text-[10px] text-muted">
                  {b.contactNumber}
                </p>
              </TableCell>

              <TableCell className="font-semibold">
                {b.equipmentName}
              </TableCell>

              <TableCell className="text-xs">
                {formatDate(b.startAt)} – {formatDate(b.endAt)}

                <p className="mt-1 text-[10px] text-muted">
                  {b.requiredQuantity} unit(s)
                </p>
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
                <Select
                  className="w-40 py-2 text-xs"
                  value={b.bookingStatus}
                  onChange={(e) =>
                    update(b._id, e.target.value)
                  }
                >
                  <option value={b.bookingStatus}>
                    {b.bookingStatus.replaceAll("_", " ")}
                  </option>

                  <option value="in_progress">
                    In progress
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </Select>
              </TableCell>

              <TableCell>
                <Button
                  href={`/dashboard/tracking/${b._id}`}
                  variant="outline"
                  size="sm"
                >
                  Track
                </Button>
              </TableCell>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState
          title="No rental requests yet"
          description="When customers book your equipment, requests will appear here."
        />
      )}
    </>
  )
}
