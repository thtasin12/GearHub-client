"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  CheckCircle2,
  Clock3,
  ArrowRight,
  ShieldCheck
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PageLoader } from "@/components/page-loader"
import { apiGet } from "@/lib/api"
import { formatMoney } from "@/lib/utils"

type PaymentCheck = {
  status: string
  amount: number
  currency: string
  bookingId: string
}

function SuccessContent() {
  const params = useSearchParams()
  const sessionId = params.get("session_id") || ""

  const [status, setStatus] = useState("checking")
  const [payment, setPayment] = useState<PaymentCheck | null>(null)
  const [message, setMessage] = useState(
    "Waiting for Stripe to confirm your payment…"
  )

  useEffect(() => {
    let alive = true
    let attempts = 0
    let timer: ReturnType<typeof setTimeout>

    async function check() {
      if (!sessionId) {
        setStatus("missing")
        setMessage("No checkout session was found.")
        return
      }

      try {
        const data = await apiGet<PaymentCheck>(
          `/api/payments/session/${encodeURIComponent(sessionId)}`,
          true
        )

        if (!alive) return

        setPayment(data)

        if (data.status === "paid") {
          setStatus("paid")
          setMessage(
            "Your payment has been verified and your rental is confirmed."
          )
          return
        }

        if (data.status === "pending" && attempts < 8) {
          attempts += 1
          timer = setTimeout(check, 2500)
          return
        }

        setStatus(data.status)

        setMessage(
          data.status === "review_required"
            ? "Your payment is being reviewed. Please contact support."
            : "Payment is not confirmed yet. Check your rentals for the latest status."
        )
      } catch (error) {
        if (!alive) return

        setStatus("pending")

        setMessage(
          error instanceof Error
            ? error.message
            : "Payment status is still being processed."
        )

        if (attempts < 5) {
          attempts += 1
          timer = setTimeout(check, 3000)
        }
      }
    }

    check()

    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [sessionId])

  return (
    <>
      <Navbar />

      <main className="container-shell grid min-h-[68vh] place-items-center py-16">
        <div className="w-full max-w-xl rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow)] sm:p-12">
          {status === "paid" ? (
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={34} />
            </span>
          ) : (
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-50 text-amber-600">
              <Clock3 size={32} />
            </span>
          )}

          <p className="section-kicker mt-5">
            {status === "paid" ? "Payment confirmed" : "Payment update"}
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-.05em]">
            {status === "paid"
              ? "You’re all set."
              : "We’re checking your payment."}
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
            {message}
          </p>

          {payment && (
            <div className="mt-6 rounded-2xl bg-[var(--surface-muted)] p-4">
              <p className="text-xs text-muted">
                Payment amount
              </p>

              <p className="mt-1 text-2xl font-black">
                {formatMoney(
                  payment.amount,
                  payment.currency.toUpperCase()
                )}
              </p>

              <p className="mt-1 text-[10px] text-muted">
                Payment status: {payment.status}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/dashboard/rentals">
              View my rentals
              <ArrowRight size={16} />
            </Button>

            <Button href="/equipment" variant="outline">
              Explore more gear
            </Button>
          </div>

          <p className="mt-7 flex items-center justify-center gap-2 text-[10px] text-muted">
            <ShieldCheck size={13} className="text-emerald-600" />
            Securely verified by GearHub
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SuccessContent />
    </Suspense>
  )
}