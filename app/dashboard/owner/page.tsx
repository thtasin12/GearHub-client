
"use client"

import { useQuery } from "@tanstack/react-query"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import {
  Package,
  CalendarCheck,
  Wallet,
  TrendingUp,
  PlusCircle
} from "lucide-react"

import { PageTitle } from "@/components/dashboard/page-title"
import { StatCard } from "@/components/dashboard/stat-card"
import { Card, CardBody } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { apiGet } from "@/lib/api"
import { formatMoney } from "@/lib/utils"

type Analytics = {
  totalEquipment: number
  completedRentals: number
  totalEarnings: number
  monthlyEarnings: Array<{
    _id: {
      year: number
      month: number
    }
    earnings: number
    bookings: number
  }>
}

export default function OwnerDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["owner-analytics"],
    queryFn: () => apiGet<Analytics>("/api/owner/analytics", true),
    retry: 0
  })

  const chart = (data?.monthlyEarnings || []).map((x) => ({
    month: new Date(
      x._id.year,
      x._id.month - 1
    ).toLocaleDateString("en-US", {
      month: "short"
    }),
    earnings: x.earnings
  }))

  return (
    <>
      <PageTitle
        eyebrow="OWNER WORKSPACE"
        title="Your rental business"
        description="Track the performance of your listings and keep your rental operation moving."
        action={
          <Button href="/dashboard/owner/add-equipment">
            <PlusCircle size={16} />
            Add equipment
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Listed equipment"
          value={isLoading ? "—" : data?.totalEquipment ?? 0}
          icon={Package}
          accent
        />

        <StatCard
          label="Completed rentals"
          value={isLoading ? "—" : data?.completedRentals ?? 0}
          icon={CalendarCheck}
        />

        <StatCard
          label="Total earnings"
          value={
            isLoading
              ? "—"
              : formatMoney(data?.totalEarnings ?? 0)
          }
          icon={Wallet}
        />

        <StatCard
          label="Monthly trend"
          value={chart.length ? "Active" : "—"}
          detail="Based on paid transactions"
          icon={TrendingUp}
        />
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
        <Card>
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
            <div>
              <h2 className="font-extrabold">
                Earnings overview
              </h2>

              <p className="mt-1 text-xs text-muted">
                Monthly paid rental earnings
              </p>
            </div>

            <span className="rounded-lg bg-[var(--orange-soft)] px-3 py-1.5 text-xs font-bold text-[var(--orange)]">
              Last 6 months
            </span>
          </div>

          <CardBody className="h-[310px] pt-5">
            {chart.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chart}
                  margin={{
                    top: 10,
                    right: 8,
                    left: 0,
                    bottom: 0
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "var(--muted)"
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: "var(--muted)"
                    }}
                  />

                  <Tooltip
                    formatter={(value) => formatMoney(Number(value))}
                  />

                  <Bar
                    dataKey="earnings"
                    fill="#f47732"
                    radius={[7, 7, 0, 0]}
                    maxBarSize={44}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center text-center">
                <div>
                  <p className="font-bold">
                    Your chart will appear here
                  </p>

                  <p className="mt-2 text-xs text-muted">
                    Once you receive paid rentals, monthly earnings
                    will be shown.
                  </p>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <h2 className="font-extrabold">
              Owner checklist
            </h2>

            <div className="mt-5 space-y-4">
              {[
                {
                  title: "Keep your listings up to date",
                  desc: "Review your pricing, condition and availability."
                },
                {
                  title: "Respond to rental requests",
                  desc: "Fast responses help customers plan their projects."
                },
                {
                  title: "Complete handover reports",
                  desc: "Document equipment condition at pickup and return."
                }
              ].map((x, i) => (
                <div key={x.title} className="flex gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--orange-soft)] text-xs font-black text-[var(--orange)]">
                    0{i + 1}
                  </span>

                  <div>
                    <p className="text-sm font-bold">
                      {x.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted">
                      {x.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              href="/dashboard/owner/equipment"
              variant="outline"
              className="mt-7 w-full"
            >
              Manage equipment
            </Button>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
