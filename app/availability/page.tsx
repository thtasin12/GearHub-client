
"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { CalendarDays, Search } from "lucide-react"

import { PageTitle } from "@/components/dashboard/page-title"
import { Card, CardBody } from "@/components/ui/card"
import { Input, Label } from "@/components/ui/field"
import { Button } from "@/components/ui/button"

import { apiGet } from "@/lib/api"
import { formatDate } from "@/lib/utils"

type Availability = {
  capacity: number
  reservations: Array<{
    startAt: string
    endAt: string
    requiredQuantity: number
    bookingStatus: string
  }>
}

export default function AvailabilityPage() {
  const [id, setId] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [search, setSearch] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ["availability", id, from, to],
    queryFn: () =>
      apiGet<Availability>(
        `/api/equipment/${id}/availability?from=${encodeURIComponent(
          new Date(`${from}T00:00:00`).toISOString()
        )}&to=${encodeURIComponent(
          new Date(`${to}T00:00:00`).toISOString()
        )}`
      ),
    enabled: search && Boolean(id && from && to),
    retry: 0
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()

    if (!id || !from || !to || new Date(to) <= new Date(from)) {
      return
    }

    setSearch(true)
  }

  return (
    <>
      <PageTitle
        eyebrow="PLANNING TOOLS"
        title="Availability planner"
        description="Check active rental reservations for an equipment listing across your planned dates."
      />

      <Card>
        <CardBody>
          <form
            onSubmit={submit}
            className="grid gap-4 md:grid-cols-[1.3fr_1fr_1fr_auto] md:items-end"
          >
            <div>
              <Label>Equipment ID</Label>

              <Input
                required
                value={id}
                onChange={(e) => {
                  setId(e.target.value)
                  setSearch(false)
                }}
                placeholder="Paste equipment listing ID"
              />
            </div>

            <div>
              <Label>From</Label>

              <Input
                required
                type="date"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value)
                  setSearch(false)
                }}
              />
            </div>

            <div>
              <Label>To</Label>

              <Input
                required
                type="date"
                min={from}
                value={to}
                onChange={(e) => {
                  setTo(e.target.value)
                  setSearch(false)
                }}
              />
            </div>

            <Button type="submit">
              <Search size={15} />
              Check dates
            </Button>
          </form>
        </CardBody>
      </Card>

      {isLoading ? (
        <div className="mt-6 h-48 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
      ) : data ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-[.7fr_1.3fr]">
          <Card>
            <CardBody>
              <span className="grid size-11 place-items-center rounded-xl bg-[var(--orange-soft)] text-[var(--orange)]">
                <CalendarDays />
              </span>

              <p className="mt-5 text-xs text-muted">
                Total listed capacity
              </p>

              <p className="mt-1 text-3xl font-black">
                {data.capacity}{" "}
                <span className="text-sm text-muted">
                  units
                </span>
              </p>

              <p className="mt-5 text-xs text-muted">
                Reservations overlapping {formatDate(from)} –{" "}
                {formatDate(to)}
              </p>

              <p className="mt-1 text-2xl font-black">
                {data.reservations.length}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="font-extrabold">
                Existing reservations
              </h2>

              {data.reservations.length ? (
                <div className="mt-4 space-y-3">
                  {data.reservations.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl bg-[var(--surface-muted)] p-4"
                    >
                      <div>
                        <p className="text-sm font-bold">
                          {formatDate(r.startAt)} – {formatDate(r.endAt)}
                        </p>

                        <p className="mt-1 text-[10px] text-muted">
                          {r.bookingStatus.replaceAll("_", " ")}
                        </p>
                      </div>

                      <span className="text-sm font-black">
                        {r.requiredQuantity} unit(s)
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-emerald-600">
                  No reservations overlap these dates.
                </p>
              )}
            </CardBody>
          </Card>
        </div>
      ) : error ? (
        <p className="mt-5 rounded-xl bg-red-50 p-4 text-xs text-red-700">
          {error instanceof Error
            ? error.message
            : "Could not load availability."}
        </p>
      ) : (
        <p className="mt-6 text-sm text-muted">
          Enter an equipment ID and rental dates to view existing reservations.
        </p>
      )}
    </>
  )
}
