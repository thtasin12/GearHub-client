
"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { PageTitle } from "@/components/dashboard/page-title"
import { DataTable } from "@/components/dashboard/data-table"
import { TableCell } from "@/components/dashboard/table-cell"
import { Select } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"

import { apiDelete, apiGet, apiPatch } from "@/lib/api"
import type { Equipment } from "@/lib/types"
import { formatMoney, formatDate } from "@/lib/utils"

export default function AdminEquipmentPage() {
  const [filter, setFilter] = useState("pending")

  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["admin-equipment", filter],
    queryFn: () =>
      apiGet<Equipment[]>(
        `/api/admin/equipment${filter === "all" ? "" : `?status=${filter}`}`,
        true
      )
  })

  async function setStatus(id: string, status: string) {
    try {
      await apiPatch(
        `/api/admin/equipment/${id}/status`,
        { status },
        true
      )

      toast.success(`Equipment ${status}`)

      qc.invalidateQueries({
        queryKey: ["admin-equipment"]
      })
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "Could not update listing"
      )
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Permanently delete this listing?")) return

    try {
      await apiDelete(`/api/admin/equipment/${id}`)

      toast.success("Listing deleted")

      qc.invalidateQueries({
        queryKey: ["admin-equipment"]
      })
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "Delete failed"
      )
    }
  }

  return (
    <>
      <PageTitle
        eyebrow="ADMIN"
        title="Equipment moderation"
        description="Review owner listings, approve suitable equipment and remove inaccurate submissions."
        action={
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-44"
          >
            <option value="pending">Pending review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All listings</option>
          </Select>
        }
      />

      {isLoading ? (
        <div className="h-56 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
      ) : data?.length ? (
        <DataTable
          columns={[
            "Equipment",
            "Owner",
            "Category",
            "Price",
            "Submitted",
            "Status",
            "Moderation"
          ]}
        >
          {data.map((x) => (
            <tr key={x._id}>
              <TableCell>
                <p className="font-bold">
                  {x.name}
                </p>

                <p className="mt-1 text-[10px] text-muted">
                  {x.location?.city}
                </p>
              </TableCell>

              <TableCell className="text-xs">
                {x.ownerName || "—"}
              </TableCell>

              <TableCell className="max-w-44 text-xs">
                {x.category}
              </TableCell>

              <TableCell className="text-xs font-bold">
                {formatMoney(x.rentalPrice)} / {x.rentalType}
              </TableCell>

              <TableCell className="text-xs">
                {formatDate(
                  (x as unknown as { createdAt: string }).createdAt
                )}
              </TableCell>

              <TableCell>
                <StatusBadge status={x.status} />
              </TableCell>

              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      window.location.assign(
                        `/dashboard/admin/equipment/${x._id}/edit`
                      )
                    }
                  >
                    Edit
                  </Button>

                  {x.status !== "approved" && (
                    <Button
                      size="sm"
                      onClick={() => setStatus(x._id, "approved")}
                    >
                      Approve
                    </Button>
                  )}

                  {x.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStatus(x._id, "rejected")}
                    >
                      Reject
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(x._id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState
          title="Nothing to review"
          description="There are no listings in this moderation queue."
        />
      )}
    </>
  )
}
