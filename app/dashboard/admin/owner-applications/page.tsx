
"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { PageTitle } from "@/components/dashboard/page-title"
import { DataTable } from "@/components/dashboard/data-table"
import { TableCell } from "@/components/dashboard/table-cell"
import { Button } from "@/components/ui/button"
import { Input, Select, Label } from "@/components/ui/field"
import { StatusBadge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"
import { Card, CardBody } from "@/components/ui/card"

import { apiGet, apiPatch } from "@/lib/api"
import { formatDate, initials } from "@/lib/utils"
import type { PageResult } from "@/lib/types"

type OwnerApplication = {
  _id: string
  applicantId: string
  applicantEmail: string
  applicantName: string
  phone: string
  address: string
  reason: string
  status: "pending" | "approved" | "rejected"
  reviewNote?: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

type ReviewState = {
  id: string
  action: "approved" | "rejected"
  note: string
  busy: boolean
}

export default function AdminOwnerApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState("pending")
  const [page, setPage] = useState(1)
  const [review, setReview] = useState<ReviewState | null>(null)

  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["admin-owner-applications", statusFilter, page],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: "20" })
      if (statusFilter !== "all") params.set("status", statusFilter)
      return apiGet<PageResult<OwnerApplication>>(
        `/api/admin/owner-applications?${params.toString()}`,
        true
      )
    }
  })

  async function submitReview(id: string, status: "approved" | "rejected", reviewNote: string) {
    setReview((prev) => (prev ? { ...prev, busy: true } : null))

    try {
      await apiPatch(`/api/admin/owner-applications/${id}`, { status, reviewNote }, true)

      toast.success(
        status === "approved"
          ? "Application approved — applicant promoted to owner"
          : "Application rejected"
      )

      setReview(null)
      qc.invalidateQueries({ queryKey: ["admin-owner-applications"] })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update application")
      setReview((prev) => (prev ? { ...prev, busy: false } : null))
    }
  }

  const items = data?.items || []
  const pagination = data?.pagination

  return (
    <>
      <PageTitle
        eyebrow="ADMIN"
        title="Owner applications"
        description="Review and act on customer requests to become equipment owners on GearHub."
        action={
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="w-44"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All applications</option>
          </Select>
        }
      />

      {/* Review modal */}
      {review && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <CardBody className="p-6">
              <h2 className="font-extrabold">
                {review.action === "approved"
                  ? "Approve application"
                  : "Reject application"}
              </h2>

              <p className="mt-1 text-sm text-muted">
                {review.action === "approved"
                  ? "The applicant will be promoted to owner and notified."
                  : "The applicant will be notified of the rejection."}
              </p>

              <div className="mt-5">
                <Label htmlFor="review-note">
                  Review note{" "}
                  <span className="text-muted">(optional)</span>
                </Label>

                <Input
                  id="review-note"
                  value={review.note}
                  onChange={(e) =>
                    setReview((prev) =>
                      prev ? { ...prev, note: e.target.value } : null
                    )
                  }
                  placeholder="Add a note for the applicant…"
                  maxLength={1000}
                  disabled={review.busy}
                />
              </div>

              <div className="mt-5 flex gap-3">
                <Button
                  onClick={() =>
                    submitReview(review.id, review.action, review.note)
                  }
                  disabled={review.busy}
                  variant={
                    review.action === "approved" ? "primary" : "destructive"
                  }
                >
                  {review.busy
                    ? "Processing…"
                    : review.action === "approved"
                      ? "Confirm approve"
                      : "Confirm reject"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setReview(null)}
                  disabled={review.busy}
                >
                  Cancel
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {isLoading ? (
        <div className="h-56 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
      ) : items.length ? (
        <>
          <DataTable
            columns={[
              "Applicant",
              "Phone",
              "Address",
              "Reason",
              "Submitted",
              "Status",
              "Actions"
            ]}
          >
            {items.map((app) => (
              <tr key={app._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--orange-soft)] text-[10px] font-black text-[var(--orange)]">
                      {initials(app.applicantName)}
                    </span>

                    <div>
                      <p className="font-bold">{app.applicantName}</p>

                      <p className="mt-0.5 text-[10px] text-muted">
                        {app.applicantEmail}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-xs">{app.phone}</TableCell>

                <TableCell className="max-w-[160px] text-xs">
                  <span className="line-clamp-2">{app.address}</span>
                </TableCell>

                <TableCell className="max-w-[200px] text-xs">
                  <span className="line-clamp-3">{app.reason}</span>
                </TableCell>

                <TableCell className="text-xs">
                  {formatDate(app.createdAt)}
                </TableCell>

                <TableCell>
                  <StatusBadge status={app.status} />
                </TableCell>

                <TableCell>
                  {app.status === "pending" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          setReview({
                            id: app._id,
                            action: "approved",
                            note: "",
                            busy: false
                          })
                        }
                      >
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setReview({
                            id: app._id,
                            action: "rejected",
                            note: "",
                            busy: false
                          })
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <div className="text-xs text-muted">
                      {app.reviewNote ? (
                        <span
                          title={app.reviewNote}
                          className="cursor-help underline decoration-dotted"
                        >
                          Has note
                        </span>
                      ) : (
                        "Reviewed"
                      )}
                    </div>
                  )}
                </TableCell>
              </tr>
            ))}
          </DataTable>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between gap-4 text-sm">
              <p className="text-muted">
                Page {pagination.page} of {pagination.totalPages} &mdash;{" "}
                {pagination.total} total
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No applications found"
          description={
            statusFilter === "all"
              ? "No owner applications have been submitted yet."
              : `There are no ${statusFilter} owner applications.`
          }
        />
      )}
    </>
  )
}
