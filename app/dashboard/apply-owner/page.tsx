
"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ClipboardCheck, Clock, CheckCircle2, XCircle, Send } from "lucide-react"
import { toast } from "sonner"

import { PageTitle } from "@/components/dashboard/page-title"
import { Card, CardBody } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input, Label, Textarea } from "@/components/ui/field"
import { StatusBadge } from "@/components/ui/badge"

import { apiGet, apiPost } from "@/lib/api"
import { formatDate } from "@/lib/utils"

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

function StatusPanel({ application }: { application: OwnerApplication }) {
  const isPending = application.status === "pending"
  const isApproved = application.status === "approved"
  const isRejected = application.status === "rejected"

  const icon = isPending ? (
    <Clock size={28} className="text-amber-600" />
  ) : isApproved ? (
    <CheckCircle2 size={28} className="text-emerald-600" />
  ) : (
    <XCircle size={28} className="text-red-600" />
  )

  const bgColor = isPending
    ? "bg-amber-50 dark:bg-amber-950/30"
    : isApproved
      ? "bg-emerald-50 dark:bg-emerald-950/30"
      : "bg-red-50 dark:bg-red-950/30"

  const title = isPending
    ? "Application under review"
    : isApproved
      ? "Application approved!"
      : "Application rejected"

  const description = isPending
    ? "Your owner application has been submitted and is awaiting admin review. We'll notify you once a decision has been made."
    : isApproved
      ? "Congratulations! Your application has been approved. You now have access to the owner workspace where you can list equipment."
      : "Unfortunately, your owner application was not approved at this time. Please review the feedback below and consider reapplying."

  return (
    <Card>
      <CardBody className="p-6">
        <div className={`flex items-start gap-4 rounded-2xl p-5 ${bgColor}`}>
          <div className="mt-0.5 shrink-0">{icon}</div>

          <div className="flex-1">
            <h2 className="font-extrabold">{title}</h2>

            <p className="mt-1 text-sm leading-6 text-muted">{description}</p>

            {application.reviewNote && (
              <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                  Admin review note
                </p>

                <p className="mt-2 text-sm leading-6">
                  {application.reviewNote}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-[var(--border)] pt-6 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
              Status
            </p>

            <div className="mt-1.5">
              <StatusBadge status={application.status} />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
              Submitted
            </p>

            <p className="mt-1.5 text-sm font-semibold">
              {formatDate(application.createdAt)}
            </p>
          </div>

          {application.reviewedAt && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                Reviewed
              </p>

              <p className="mt-1.5 text-sm font-semibold">
                {formatDate(application.reviewedAt)}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-[var(--border)] pt-6">
          <h3 className="font-bold">Your application details</h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                Phone
              </p>

              <p className="mt-1.5 text-sm">{application.phone}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                Address
              </p>

              <p className="mt-1.5 text-sm">{application.address}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                Reason for applying
              </p>

              <p className="mt-1.5 text-sm leading-6">{application.reason}</p>
            </div>
          </div>
        </div>

        {isApproved && (
          <div className="mt-6 border-t border-[var(--border)] pt-6">
            <Button href="/dashboard/owner">
              Go to owner workspace
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

function ApplicationForm({ onSuccess }: { onSuccess: () => void }) {
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [reason, setReason] = useState("")
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)

    try {
      await apiPost(
        "/api/owner-applications",
        { phone, address, reason },
        true
      )

      toast.success("Application submitted successfully!")
      onSuccess()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not submit application"
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <CardBody className="p-6">
        <div className="mb-6 flex items-start gap-4 rounded-2xl bg-[var(--orange-soft)] p-5">
          <ClipboardCheck
            size={26}
            className="mt-0.5 shrink-0 text-[var(--orange)]"
          />

          <div>
            <h2 className="font-extrabold text-[var(--orange)]">
              Become an equipment owner
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted">
              Fill out this application to list your equipment on GearHub. Our
              team will review your request and get back to you shortly.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div>
            <Label htmlFor="phone">Phone number</Label>

            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              required
              minLength={6}
              maxLength={30}
            />
          </div>

          <div>
            <Label htmlFor="address">Your address</Label>

            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="City, Area, Country"
              required
              minLength={5}
              maxLength={500}
            />
          </div>

          <div>
            <Label htmlFor="reason">
              Why do you want to become an owner?
            </Label>

            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tell us about the equipment you plan to list, your experience, and why you'd like to join as an owner… (at least 20 characters)"
              required
              minLength={20}
              maxLength={2000}
              className="min-h-36"
            />

            <p className="mt-1.5 text-[11px] text-muted">
              {reason.length} / 2000 characters
            </p>
          </div>

          <div>
            <Button type="submit" disabled={busy}>
              {busy ? "Submitting…" : "Submit application"}
              <Send size={15} />
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}

export default function ApplyOwnerPage() {
  const qc = useQueryClient()

  const { data: application, isLoading } = useQuery({
    queryKey: ["my-owner-application"],
    queryFn: () =>
      apiGet<OwnerApplication | null>("/api/owner-applications/me", true),
    retry: 0
  })

  function handleSuccess() {
    qc.invalidateQueries({ queryKey: ["my-owner-application"] })
  }

  return (
    <>
      <PageTitle
        eyebrow="CUSTOMER"
        title="Become an owner"
        description="Apply to list your equipment on GearHub and start earning by renting to customers near you."
      />

      {isLoading ? (
        <div className="h-80 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
      ) : application ? (
        <StatusPanel application={application} />
      ) : (
        <ApplicationForm onSuccess={handleSuccess} />
      )}
    </>
  )
}
