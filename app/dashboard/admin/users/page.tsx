
"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Search } from "lucide-react"
import { toast } from "sonner"

import { PageTitle } from "@/components/dashboard/page-title"
import { DataTable } from "@/components/dashboard/data-table"
import { TableCell } from "@/components/dashboard/table-cell"
import { Button } from "@/components/ui/button"
import { Input, Select } from "@/components/ui/field"
import { StatusBadge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"

import { apiGet, apiPatch } from "@/lib/api"
import { formatDate, initials } from "@/lib/utils"

type AdminUser = {
  id?: string
  _id?: string
  name: string
  email: string
  role: string
  image?: string
  isBlocked?: boolean
  createdAt?: string
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")

  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: () =>
      apiGet<{
        items: AdminUser[]
        pagination: unknown
      }>(
        `/api/admin/users?page=1&limit=100&search=${encodeURIComponent(search)}`,
        true
      )
  })

  async function role(id: string, role: string) {
    try {
      await apiPatch(
        `/api/admin/users/${encodeURIComponent(id)}/role`,
        { role },
        true
      )

      toast.success("User role updated")

      qc.invalidateQueries({
        queryKey: ["admin-users"]
      })
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "Could not change role"
      )
    }
  }

  async function block(id: string, blocked: boolean) {
    try {
      await apiPatch(
        `/api/admin/users/${encodeURIComponent(id)}/block`,
        { isBlocked: blocked },
        true
      )

      toast.success(
        blocked ? "User blocked" : "User unblocked"
      )

      qc.invalidateQueries({
        queryKey: ["admin-users"]
      })
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "Could not update user"
      )
    }
  }

  return (
    <>
      <PageTitle
        eyebrow="ADMIN"
        title="User management"
        description="Review registered accounts and manage customer, owner and admin permissions."
      />

      <div className="mb-5 max-w-md">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="h-56 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
      ) : data?.items.length ? (
        <DataTable
          columns={[
            "User",
            "Role",
            "Joined",
            "Access",
            "Change role",
            "Actions"
          ]}
        >
          {data.items.map((u) => {
            const id = u.email

            return (
              <tr key={id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-[var(--orange-soft)] text-[10px] font-black text-[var(--orange)]">
                      {initials(u.name)}
                    </span>

                    <div>
                      <p className="font-bold">
                        {u.name}
                      </p>

                      <p className="mt-1 text-[10px] text-muted">
                        {u.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <StatusBadge status={u.role} />
                </TableCell>

                <TableCell className="text-xs">
                  {formatDate(u.createdAt)}
                </TableCell>

                <TableCell>
                  <StatusBadge
                    status={u.isBlocked ? "blocked" : "active"}
                  />
                </TableCell>

                <TableCell>
                  <Select
                    className="w-32 py-2 text-xs"
                    value={u.role}
                    onChange={(e) => role(id, e.target.value)}
                  >
                    <option value="customer">Customer</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                  </Select>
                </TableCell>

                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={u.role === "admin"}
                    onClick={() => block(id, !u.isBlocked)}
                  >
                    {u.isBlocked ? "Unblock" : "Block"}
                  </Button>
                </TableCell>
              </tr>
            )
          })}
        </DataTable>
      ) : (
        <EmptyState
          title="No users found"
          description="Try a different search term."
        />
      )}
    </>
  )
}
