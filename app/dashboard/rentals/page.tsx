
"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ExternalLink } from "lucide-react"
import { toast } from "sonner"

import { PageTitle } from "@/components/dashboard/page-title"
import { DataTable } from "@/components/dashboard/data-table"
import { TableCell } from "@/components/dashboard/table-cell"
import { StatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"

import { apiGet, apiPost } from "@/lib/api"
import type { Booking, PageResult } from "@/lib/types"
import { formatDate, formatMoney } from "@/lib/utils"

export default function RentalsPage() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["my-rentals"],
    queryFn: () =>
      apiGet<PageResult<Booking>>(
        "/api/bookings/my?page=1&limit=100",
        true
      )
  })

  async function cancel(id: string) {
    try {
      await apiPost(`/api/bookings/${id}/cancel`, {}, true)

      toast.success("Booking cancelled")
      qc.invalidateQueries({ queryKey: ["my-rentals"] })
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not cancel booking"
      )
    }
  }

  const items = data?.items || []

  return (
    <>
      <PageTitle
        eyebrow="CUSTOMER"
        title="My rentals"
        description="See your booking history, payment status and rental progress."
        action={
          <Button href="/equipment">
            Book equipment
          </Button>
        }
      />

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
      ) : items.length ? (
        <DataTable
          columns={[
            "Equipment",
            "Rental dates",
            "Booking date",
            "Total amount",
            "Payment",
            "Booking status",
            "Actions"
          ]}
        >
          {items.map((b) => (
            <tr key={b._id}>
              <TableCell>
                <div className="min-w-40 font-bold">
                  {b.equipmentName}
                </div>

                <p className="mt-1 text-[10px] text-muted">
                  Qty: {b.requiredQuantity}
                </p>
              </TableCell>

              <TableCell>
                <span className="text-xs">
                  {formatDate(b.startAt)}
                  <br />
                  to {formatDate(b.endAt)}
                </span>
              </TableCell>

              <TableCell className="text-xs">
                {formatDate(b.createdAt)}
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
                <div className="flex gap-2">
                  {b.bookingStatus === "pending_payment" && (
                    <Button
                      href={`/checkout/${b._id}`}
                      size="sm"
                    >
                      Pay now
                    </Button>
                  )}

                  <Button
                    href={`/dashboard/tracking/${b._id}`}
                    variant="outline"
                    size="sm"
                  >
                    <ExternalLink size={13} />
                  </Button>

                  {!["completed", "cancelled", "expired"].includes(
                    b.bookingStatus
                  ) &&
                    b.paymentStatus !== "paid" && (
                      <Button
                        onClick={() => cancel(b._id)}
                        variant="ghost"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    )}
                </div>
              </TableCell>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState
          title="No rentals yet"
          description="When you book equipment, your rental details and payment history will appear here."
        />
      )}
    </>
  )
}
