"use client"

import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import {
  ArrowLeft,
  BadgeCheck,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react"
import { toast } from "sonner"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageLoader } from "@/components/page-loader"
import { Button } from "@/components/ui/button"
import { Card, CardBody } from "@/components/ui/card"
import { Input, Label, Select, Textarea } from "@/components/ui/field"
import { apiGet, apiPost } from "@/lib/api"

import { DEMO_EQUIPMENT } from "@/lib/constants"
import { formatMoney } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import type { Equipment } from "@/lib/types"

function ReviewComposer({ equipmentId }: { equipmentId: string }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [busy, setBusy] = useState(false)
  const session = authClient.useSession()

  if (!session.data?.user || equipmentId.startsWith("demo-")) {
    return null
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (comment.trim().length < 5) {
      toast.error("Write at least 5 characters.")
      return
    }

    setBusy(true)

    try {
      await apiPost(`/api/equipment/${equipmentId}/reviews`, { rating, comment }, true)
      toast.success("Review submitted")
      setComment("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit review")
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 rounded-2xl border border-(--border) p-4">
      <h3 className="font-bold">Share your rental experience</h3>
      <p className="mt-1 text-xs text-muted">
        Available after you complete a paid rental of this equipment.
      </p>

      <div className="mt-3 flex items-center gap-2">
        <Label htmlFor="review-rating">Rating</Label>
        <Select
          id="review-rating"
          value={String(rating)}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-24 py-2"
        >
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars</option>
          <option value="2">2 stars</option>
          <option value="1">1 star</option>
        </Select>
      </div>

      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mt-3"
        placeholder="What was your experience with this equipment?"
      />

      <Button type="submit" size="sm" className="mt-3" disabled={busy}>
        {busy ? "Submitting…" : "Submit review"}
      </Button>
    </form>
  )
}

export default function EquipmentDetailPage() {
  const params = useParams<{ id: string }>()
  const id = String(params.id)
  const router = useRouter()
  const session = authClient.useSession()

  useEffect(() => {
    if (!session.isPending && !session.data?.user) {
      router.replace(`/login?next=${encodeURIComponent(`/equipment/${id}`)}`)
    }
  }, [session.isPending, session.data?.user, router, id])

  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [busy, setBusy] = useState(false)

  const { data: item, isLoading } = useQuery({
    queryKey: ["equipment-detail", id],
    queryFn: async () => {
      const demo = DEMO_EQUIPMENT.find((x) => x._id === id)

      if (demo) {
        return demo as unknown as Equipment
      }

      return apiGet<Equipment>(`/api/equipment/${id}`)
    },
    retry: 0,
  })

  async function book() {
    if (!session.data?.user) {
      router.push(`/login?next=${encodeURIComponent(`/equipment/${id}`)}`)
      return
    }

    if (!start || !end || !phone || !address) {
      toast.error("Please complete rental dates, phone and delivery address.")
      return
    }

    if (new Date(end) <= new Date(start)) {
      toast.error("End date must be after start date.")
      return
    }

    if (id.startsWith("demo-")) {
      toast.info("This is a sample listing. Connect the backend and use a live listing to book.")
      return
    }

    setBusy(true)

    try {
      const booking = await apiPost<{ _id: string }>(
        "/api/bookings",
        {
          equipmentId: id,
          startAt: new Date(`${start}T00:00:00`).toISOString(),
          endAt: new Date(`${end}T00:00:00`).toISOString(),
          requiredQuantity: Number(quantity),
          contactNumber: phone,
          deliveryAddress: address,
          additionalNotes: notes,
        },
        true
      )

      router.push(`/checkout/${booking._id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Booking could not be created")
      setBusy(false)
    }
  }

  async function favorite() {
    if (!session.data?.user) {
      router.push("/login")
      return
    }

    try {
      await apiPost(`/api/favorites/${id}`, undefined, true)
      toast.success("Added to favorites")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save favorite")
    }
  }

  async function messageOwner() {
    if (!session.data?.user) {
      router.push("/login")
      return
    }

    try {
      const conversation = await apiPost<{ _id: string }>(
        "/api/conversations",
        { equipmentId: id },
        true
      )

      router.push(`/dashboard/messages?conversation=${conversation._id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start conversation")
    }
  }

  if (session.isPending || !session.data?.user || isLoading) {
    return (
      <>
        <Navbar />
        <PageLoader label="Loading equipment details" />
        <Footer />
      </>
    )
  }

  if (!item) {
    return (
      <>
        <Navbar />
        <div className="container-shell py-24 text-center">
          <h1 className="text-2xl font-black">Equipment not found</h1>
          <Button href="/equipment" className="mt-5">
            Back to marketplace
          </Button>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="container-shell py-9">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-(--orange)"
        >
          <ArrowLeft size={15} />
          Back to equipment
        </button>

        <div className="grid gap-9 lg:grid-cols-[1.25fr_.75fr]">
          <div>
            <div className="relative aspect-[1.65] overflow-hidden rounded-[26px] bg-(--surface-muted)">
              <Image
                src={item.image}
                alt={item.name}
                fill
                unoptimized
                priority
                className="object-cover"
              />
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-(--orange-soft) px-3 py-1.5 text-[11px] font-bold text-(--orange)">
                {item.category}
              </span>

              <div className="flex items-center gap-2">
                <Button onClick={favorite} variant="outline" size="sm">
                  <Heart size={15} />
                  Save
                </Button>
                <Button onClick={messageOwner} variant="outline" size="sm">
                  <MessageCircle size={15} />
                  Ask owner
                </Button>
              </div>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-[-.045em] sm:text-4xl">
              {item.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {item.location?.address}, {item.location?.city}
              </span>

              <span className="flex items-center gap-1.5 text-amber-500">
                <Star size={14} fill="currentColor" />
                {Number(item.averageRating || 4.8).toFixed(1)} ({item.reviewCount || 0} reviews)
              </span>

              <span className="flex items-center gap-1.5">
                <BadgeCheck size={14} className="text-emerald-600" />
                Owner listed
              </span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Condition", value: item.condition },
                { label: "Brand", value: item.brand || "—" },
                { label: "Model", value: item.model || "—" },
                { label: "Available", value: `${item.availableQuantity} units` },
              ].map((field) => (
                <div key={field.label} className="surface rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                    {field.label}
                  </p>
                  <p className="mt-2 text-sm font-extrabold">{field.value}</p>
                </div>
              ))}
            </div>

            <section className="mt-9">
              <h2 className="text-lg font-extrabold">About this equipment</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted">
                {item.description}
              </p>
            </section>

            <section className="mt-8 rounded-2xl border border-border) p-5">
              <h2 className="font-extrabold">Rental terms & conditions</h2>
              <p className="mt-2 text-sm leading-7 text-muted">
                {item.rentalTerms ||
                  "Please handle the equipment carefully, use it only for its intended purpose and return it in the same condition. Confirm pickup and delivery arrangements with the owner before your rental begins."}
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-lg font-extrabold">Equipment owner</h2>

              <div className="surface mt-4 flex items-center gap-4 rounded-2xl p-5">
                <div className="grid size-12 place-items-center rounded-full bg-(--orange-soft) text-(--orange)">
                  <UserRound size={23} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold">
                    {item.owner?.name || item.ownerName || "Verified equipment owner"}
                  </p>
                  <p className="mt-1 text-xs text-muted">GearHub marketplace member</p>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <ShieldCheck size={14} />
                  Approved listing
                </span>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-lg font-extrabold">Customer reviews</h2>

              {item.reviews?.length ? (
                <div className="mt-4 space-y-3">
                  {item.reviews.map((review, index) => (
                    <div key={review._id || index} className="surface rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold">{review.customerName}</p>
                        <span className="flex items-center gap-1 text-xs text-amber-500">
                          <Star size={13} fill="currentColor" />
                          {review.rating}.0
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  No reviews yet. Reviews are available after a completed paid rental.
                </p>
              )}

              <ReviewComposer equipmentId={id} />
            </section>
          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            <Card className="rounded-3xl">
              <CardBody className="p-6">
                <p className="text-xs font-bold uppercase tracking-[.13em] text-muted">
                  Rental price
                </p>

                <p className="mt-2 text-3xl font-black">
                  {formatMoney(item.rentalPrice)}
                  <span className="ml-1 text-sm font-medium text-muted">
                    / {item.rentalType === "daily" ? "day" : item.rentalType === "weekly" ? "week" : "month"}
                  </span>
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="start">Rental start</Label>
                    <Input
                      id="start"
                      type="date"
                      min={new Date().toISOString().slice(0, 10)}
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="end">Rental end</Label>
                    <Input
                      id="end"
                      type="date"
                      min={start || new Date().toISOString().slice(0, 10)}
                      value={end}
                      onChange={(e) => setEnd(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="quantity">Required quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={item.availableQuantity}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(1, Math.min(item.availableQuantity, Number(e.target.value) || 1))
                        )
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Contact number</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Delivery address</Label>
                    <Textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House, road, area and city"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional notes (optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special instructions"
                      className="min-h-20"
                    />
                  </div>
                </div>

                <Button size="lg" className="mt-6 w-full" onClick={book} disabled={busy}>
                  {busy ? "Preparing secure checkout…" : "Continue to booking"}
                  <ArrowLeft className="rotate-180" size={16} />
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Secure payment powered by Stripe
                </div>

                <div className="mt-5 space-y-2 border-t border-(--border) pt-4 text-xs text-muted">
                  <p className="flex items-center justify-between">
                    <span>Availability</span>
                    <span className="font-bold text-emerald-600">
                      {item.availableQuantity} listed
                    </span>
                  </p>

                  <p className="flex items-center justify-between">
                    <span>Rental type</span>
                    <span className="font-bold">{item.rentalType}</span>
                  </p>

                  <p className="flex items-center justify-between">
                    <span>Delivery</span>
                    <span className="font-bold">Confirm with owner</span>
                  </p>
                </div>
              </CardBody>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
