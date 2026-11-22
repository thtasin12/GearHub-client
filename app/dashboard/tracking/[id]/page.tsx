
"use client"

import { useParams } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import {
  CheckCircle2,
  PackageCheck,
  Camera,
  ClipboardCheck
} from "lucide-react"
import { toast } from "sonner"

import { PageTitle } from "@/components/dashboard/page-title"
import { Card, CardBody } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Input,
  Label,
  Select,
  Textarea
} from "@/components/ui/field"
import { StatusBadge } from "@/components/ui/badge"

import { apiGet, apiPost, apiPatch } from "@/lib/api"
import { useCurrentUser } from "@/lib/hooks"
import type { Booking } from "@/lib/types"
import { formatDate, formatMoney } from "@/lib/utils"

type Tracking = {
  booking: Booking
  payments: Array<{
    status: string
    amount: number
    currency: string
    createdAt: string
  }>
  handovers: Array<{
    stage: string
    condition: string
    notes: string
    createdAt: string
    submittedByName: string
  }>
  extensions: Array<{
    _id: string
    status: string
    amount: number
    newEndAt: string
    createdAt?: string
  }>
  timeline: Array<{
    label: string
    at: string
  }>
}

export default function TrackingPage() {
  const { id } = useParams<{ id: string }>()

  const qc = useQueryClient()

  const [stage, setStage] = useState("pickup")
  const [condition, setCondition] = useState("good")
  const [notes, setNotes] = useState("")
  const [damageNotes, setDamageNotes] = useState("")
  const [newEndAt, setNewEndAt] = useState("")

  const { user } = useCurrentUser()

  const { data, isLoading } = useQuery({
    queryKey: ["rental-tracking", id],
    queryFn: () => apiGet<Tracking>(`/api/bookings/${id}/tracking`, true),
    retry: 0
  })

  async function requestExtension(e: React.FormEvent) {
    e.preventDefault()

    if (!newEndAt || !data) {
      toast.error("Choose a new rental end date.")
      return
    }

    try {
      await apiPost(
        `/api/bookings/${id}/extensions`,
        {
          newEndAt: new Date(`${newEndAt}T00:00:00`).toISOString()
        },
        true
      )

      toast.success("Extension request sent to the owner")
      setNewEndAt("")

      qc.invalidateQueries({
        queryKey: ["rental-tracking", id]
      })
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not request extension"
      )
    }
  }

  async function approveExtension(extensionId: string) {
    try {
      await apiPatch(
        `/api/extensions/${extensionId}/approve`,
        {},
        true
      )

      toast.success("Extension approved")

      qc.invalidateQueries({
        queryKey: ["rental-tracking", id]
      })
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not approve extension"
      )
    }
  }

  async function payExtension(extensionId: string) {
    try {
      const result = await apiPost<{ checkoutUrl: string }>(
        `/api/extensions/${extensionId}/checkout`,
        {},
        true
      )

      window.location.assign(result.checkoutUrl)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not start extension checkout"
      )
    }
  }

  async function report(e: React.FormEvent) {
    e.preventDefault()

    try {
      await apiPost(
        `/api/bookings/${id}/handover`,
        {
          stage,
          condition,
          notes,
          damageNotes
        },
        true
      )

      toast.success("Handover report submitted")

      qc.invalidateQueries({
        queryKey: ["rental-tracking", id]
      })

      setNotes("")
      setDamageNotes("")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not submit handover"
      )
    }
  }

  return (
    <>
      <PageTitle
        eyebrow="RENTAL TRACKING"
        title="Rental activity"
        description="Follow payment, booking and handover updates for this rental."
      />

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
      ) : data ? (
        <>
          <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
            <Card>
              <CardBody>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted">
                      Equipment
                    </p>

                    <h2 className="mt-1 text-xl font-black">
                      {data.booking.equipmentName}
                    </h2>

                    <p className="mt-2 text-xs text-muted">
                      {formatDate(data.booking.startAt)} –{" "}
                      {formatDate(data.booking.endAt)}
                    </p>
                  </div>

                  <StatusBadge status={data.booking.bookingStatus} />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[var(--surface-muted)] p-4">
                    <p className="text-[10px] text-muted">
                      Booking amount
                    </p>

                    <p className="mt-1 text-lg font-black">
                      {formatMoney(
                        data.booking.totalAmount,
                        data.booking.currency || "BDT"
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--surface-muted)] p-4">
                    <p className="text-[10px] text-muted">
                      Payment
                    </p>

                    <div className="mt-2">
                      <StatusBadge status={data.booking.paymentStatus} />
                    </div>
                  </div>
                </div>

                <h3 className="mt-7 font-extrabold">
                  Activity timeline
                </h3>

                <div className="mt-4 space-y-4">
                  {data.timeline.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--orange-soft)] text-[var(--orange)]">
                        {i === 0 ? (
                          <PackageCheck size={15} />
                        ) : (
                          <CheckCircle2 size={15} />
                        )}
                      </span>

                      <div>
                        <p className="text-sm font-bold">
                          {step.label}
                        </p>

                        <p className="mt-1 text-[10px] text-muted">
                          {formatDate(step.at, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h3 className="font-extrabold">
                  Payment history
                </h3>

                {data.payments.length ? (
                  <div className="mt-4 space-y-3">
                    {data.payments.map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl bg-[var(--surface-muted)] p-3"
                      >
                        <div>
                          <p className="text-sm font-bold">
                            {formatMoney(
                              p.amount,
                              p.currency.toUpperCase()
                            )}
                          </p>

                          <p className="mt-1 text-[10px] text-muted">
                            {formatDate(p.createdAt)}
                          </p>
                        </div>

                        <StatusBadge status={p.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-muted">
                    No payment records yet.
                  </p>
                )}

                <h3 className="mt-7 font-extrabold">
                  Handover records
                </h3>

                {data.handovers.length ? (
                  <div className="mt-3 space-y-3">
                    {data.handovers.map((h, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-[var(--border)] p-3"
                      >
                        <div className="flex justify-between">
                          <p className="text-xs font-bold">
                            {h.stage} report
                          </p>

                          <StatusBadge status={h.condition} />
                        </div>

                        <p className="mt-2 text-xs text-muted">
                          {h.notes || "No notes"}
                        </p>

                        <p className="mt-2 text-[10px] text-muted">
                          By {h.submittedByName} ·{" "}
                          {formatDate(h.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-muted">
                    No handover report submitted yet.
                  </p>
                )}
              </CardBody>
            </Card>
          </div>

          <Card className="mt-5">
            <CardBody>
              <h3 className="font-extrabold">
                Rental extensions
              </h3>

              <p className="mt-1 text-xs text-muted">
                Request extra time, approve a customer request, or
                complete extension payment.
              </p>

              {data.extensions.length ? (
                <div className="mt-4 space-y-3">
                  {data.extensions.map((extension) => (
                    <div
                      key={extension._id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] p-4"
                    >
                      <div>
                        <p className="text-sm font-bold">
                          New end date: {formatDate(extension.newEndAt)}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          {formatMoney(
                            extension.amount,
                            data.booking.currency || "BDT"
                          )}{" "}
                          · {extension.status.replaceAll("_", " ")}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {user?.role === "owner" &&
                          extension.status === "requested" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                approveExtension(extension._id)
                              }
                            >
                              Approve
                            </Button>
                          )}

                        {user?.role === "customer" &&
                          extension.status === "approved" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                payExtension(extension._id)
                              }
                            >
                              Pay extension
                            </Button>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-muted">
                  No extension requests yet.
                </p>
              )}

              {user?.role === "customer" &&
                data.booking.paymentStatus === "paid" &&
                ["confirmed", "in_progress"].includes(
                  data.booking.bookingStatus
                ) && (
                  <form
                    onSubmit={requestExtension}
                    className="mt-5 flex flex-col gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-end"
                  >
                    <div className="flex-1">
                      <Label htmlFor="extension-end">
                        Request new end date
                      </Label>

                      <Input
                        id="extension-end"
                        type="date"
                        min={new Date(
                          new Date(data.booking.endAt).getTime() +
                            86400000
                        )
                          .toISOString()
                          .slice(0, 10)}
                        value={newEndAt}
                        onChange={(e) => setNewEndAt(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={!newEndAt}>
                      Request extension
                    </Button>
                  </form>
                )}
            </CardBody>
          </Card>

          <Card className="mt-5">
            <CardBody>
              <div className="flex items-center gap-2">
                <ClipboardCheck className="text-[var(--orange)]" />

                <h3 className="font-extrabold">
                  Submit digital handover report
                </h3>
              </div>

              <p className="mt-1 text-xs text-muted">
                Pickup reports are submitted by the owner. Return
                reports are submitted by the customer.
              </p>

              <form
                onSubmit={report}
                className="mt-5 grid gap-4 md:grid-cols-2"
              >
                <div>
                  <Label>Handover stage</Label>

                  <Select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                  >
                    <option value="pickup">
                      Pickup (owner)
                    </option>

                    <option value="return">
                      Return (customer)
                    </option>
                  </Select>
                </div>

                <div>
                  <Label>Equipment condition</Label>

                  <Select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="damaged">Damaged</option>
                  </Select>
                </div>

                <div>
                  <Label>Notes</Label>

                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe the handover condition…"
                  />
                </div>

                <div>
                  <Label>Damage notes (if any)</Label>

                  <Textarea
                    value={damageNotes}
                    onChange={(e) => setDamageNotes(e.target.value)}
                    placeholder="List any existing damage or issues…"
                  />
                </div>

                <div className="md:col-span-2">
                  <Button type="submit">
                    <Camera size={15} />
                    Submit handover report
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </>
      ) : (
        <p className="text-sm text-muted">
          Tracking data could not be loaded.
        </p>
      )}
    </>
  )
}
