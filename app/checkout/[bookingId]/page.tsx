"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Image from "next/image"
import {
  ShieldCheck,
  LockKeyhole,
  CreditCard,
  CalendarDays,
  MapPin,
  Package,
  ArrowLeft,
  ArrowRight,
  BadgeCheck
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageLoader } from "@/components/page-loader"
import { Button } from "@/components/ui/button"
import { Card, CardBody } from "@/components/ui/card"
import { apiGet, apiPost } from "@/lib/api"
import type { Booking } from "@/lib/types"
import { formatDate, formatMoney } from "@/lib/utils"
import { toast } from "sonner"

export default function CheckoutPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const router = useRouter()

  const [busy, setBusy] = useState(false)

  const {
    data: booking,
    isLoading
  } = useQuery({
    queryKey: ["booking-checkout", bookingId],
    queryFn: () => apiGet<Booking>(`/api/bookings/${bookingId}`, true),
    retry: 0
  })

  async function pay() {
    setBusy(true)

    try {
      const result = await apiPost<{ checkoutUrl: string }>(
        `/api/payments/checkout/${bookingId}`,
        {},
        true
      )

      window.location.assign(result.checkoutUrl)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not start Stripe Checkout"
      )

      setBusy(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <PageLoader label="Preparing your checkout" />
        <Footer />
      </>
    )
  }

  if (!booking) {
    return (
      <>
        <Navbar />

        <div className="container-shell py-24 text-center">
          <h1 className="text-2xl font-black">
            Booking could not be loaded
          </h1>

          <Button href="/dashboard/rentals" className="mt-5">
            My rentals
          </Button>
        </div>

        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="container-shell py-12">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-muted"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--orange-soft)] text-[var(--orange)]">
              <LockKeyhole size={23} />
            </span>

            <p className="section-kicker mt-4">
              Secure payment
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-.05em]">
              Review your booking.
            </h1>

            <p className="mt-2 text-sm text-muted">
              Your rental is held for a limited time while you complete payment.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
            <Card>
              <CardBody className="p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ShieldCheck size={20} />
                  </span>

                  <div>
                    <h2 className="font-extrabold">
                      Payment through Stripe
                    </h2>

                    <p className="text-xs text-muted">
                      Card and supported payment methods are handled by Stripe.
                    </p>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-[var(--border)] p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[var(--surface-muted)]">
                      <Image
                        src={booking.equipmentImage}
                        alt={booking.equipmentName}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                        Equipment rental
                      </p>

                      <h3 className="mt-1 font-extrabold">
                        {booking.equipmentName}
                      </h3>

                      <p className="mt-1 text-xs text-muted">
                        Owner: {booking.ownerName}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 border-t border-[var(--border)] pt-4 sm:grid-cols-2">
                    <p className="flex items-center gap-2 text-xs text-muted">
                      <CalendarDays size={15} />
                      {formatDate(booking.startAt)} – {formatDate(booking.endAt)}
                    </p>

                    <p className="flex items-center gap-2 text-xs text-muted">
                      <Package size={15} />
                      {booking.requiredQuantity} unit(s)
                    </p>

                    <p className="flex items-center gap-2 text-xs text-muted sm:col-span-2">
                      <MapPin size={15} />
                      {booking.deliveryAddress}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <BadgeCheck
                      size={17}
                      className="mt-0.5 text-emerald-600"
                    />

                    <div>
                      <p className="text-sm font-bold">
                        Protected checkout
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted">
                        Your card details are entered on Stripe’s secure checkout page, not stored by GearHub.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <LockKeyhole
                      size={17}
                      className="mt-0.5 text-emerald-600"
                    />

                    <div>
                      <p className="text-sm font-bold">
                        Booking confirmation
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted">
                        Your booking becomes confirmed only after GearHub verifies Stripe’s payment webhook.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={pay}
                  disabled={
                    busy ||
                    booking.paymentStatus === "paid" ||
                    booking.bookingStatus !== "pending_payment"
                  }
                  size="lg"
                  className="mt-8 w-full"
                >
                  {busy
                    ? "Redirecting to Stripe…"
                    : booking.paymentStatus === "paid"
                      ? "Already paid"
                      : "Continue to secure payment"}

                  <ArrowRight size={17} />
                </Button>

                <p className="mt-3 text-center text-[10px] text-muted">
                  You will be redirected to Stripe Checkout to complete payment securely.
                </p>
              </CardBody>
            </Card>

            <Card className="h-fit">
              <CardBody className="p-6">
                <h2 className="font-extrabold">
                  Payment summary
                </h2>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Rental rate</span>

                    <span className="font-semibold text-[var(--foreground)]">
                      {formatMoney(
                        booking.totalAmount / (booking.durationDays || 1)
                      )} / day
                    </span>
                  </div>

                  <div className="flex justify-between text-muted">
                    <span>Rental duration</span>

                    <span className="font-semibold text-[var(--foreground)]">
                      {booking.durationDays || "—"} days
                    </span>
                  </div>

                  <div className="flex justify-between text-muted">
                    <span>Quantity</span>

                    <span className="font-semibold text-[var(--foreground)]">
                      {booking.requiredQuantity}
                    </span>
                  </div>

                  <div className="border-t border-[var(--border)] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">
                        Total amount
                      </span>

                      <span className="text-2xl font-black text-[var(--orange)]">
                        {formatMoney(
                          booking.totalAmount,
                          booking.currency || "BDT"
                        )}
                      </span>
                    </div>

                    <p className="mt-2 text-[10px] text-muted">
                      *Final price is calculated by GearHub from the rental period and equipment rate.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-[var(--surface-muted)] p-4">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <CreditCard size={15} />
                    Payment method
                  </div>

                  <p className="mt-2 text-xs leading-5 text-muted">
                    Choose from the available methods on Stripe Checkout. Your payment status will update automatically after confirmation.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}