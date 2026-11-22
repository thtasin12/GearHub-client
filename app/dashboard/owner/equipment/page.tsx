
"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { PageTitle } from "@/components/dashboard/page-title"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/dashboard/data-table"
import { TableCell } from "@/components/dashboard/table-cell"
import { StatusBadge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"

import { apiDelete, apiGet } from "@/lib/api"
import type { Equipment, PageResult } from "@/lib/types"
import { formatMoney } from "@/lib/utils"

export default function OwnerEquipmentPage() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["owner-equipment"],
    queryFn: () =>
      apiGet<PageResult<Equipment>>(
        "/api/owner/equipment?page=1&limit=100",
        true
      )
  })

  async function remove(id: string) {
    if (!window.confirm("Delete this equipment listing?")) return

    try {
      await apiDelete(`/api/equipment/${id}`)

      toast.success("Equipment deleted")

      qc.invalidateQueries({
        queryKey: ["owner-equipment"]
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
        eyebrow="OWNER"
        title="My equipment"
        description="Manage your listings, update details and monitor approval status."
        action={
          <Button href="/dashboard/owner/add-equipment">
            Add equipment
          </Button>
        }
      />

      {isLoading ? (
        <div className="h-56 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
      ) : data?.items.length ? (
        <DataTable
          columns={[
            "Equipment",
            "Category",
            "Rental price",
            "Available",
            "Status",
            "Actions"
          ]}
        >
          {data.items.map((x) => (
            <tr key={x._id}>
              <TableCell>
                <div className="font-bold">
                  {x.name}
                </div>

                <p className="mt-1 text-[10px] text-muted">
                  {x.location?.city}
                </p>
              </TableCell>

              <TableCell className="text-xs">
                {x.category}
              </TableCell>

              <TableCell className="font-bold">
                {formatMoney(x.rentalPrice)} / {x.rentalType}
              </TableCell>

              <TableCell>
                {x.availableQuantity}
              </TableCell>

              <TableCell>
                <StatusBadge status={x.status} />
              </TableCell>

              <TableCell>
                <div className="flex gap-2">
                  <Button
                    href={`/equipment/${x._id}`}
                    variant="outline"
                    size="sm"
                  >
                    View
                  </Button>

                  <Button
                    href={`/dashboard/owner/equipment/${x._id}/edit`}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>

                  <Button
                    onClick={() => remove(x._id)}
                    variant="ghost"
                    size="sm"
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
          title="No equipment listed yet"
          description="Add your first equipment listing. It will appear in the public marketplace after admin approval."
        />
      )}
    </>
  )
}
