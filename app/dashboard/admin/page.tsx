
"use client"

import { useQuery } from "@tanstack/react-query"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart
} from "recharts"
import {
  Users,
  Package,
  CalendarDays,
  Wallet,
  ShieldCheck,
  ClipboardCheck
} from "lucide-react"

import { PageTitle } from "@/components/dashboard/page-title"
import { StatCard } from "@/components/dashboard/stat-card"
import { Card, CardBody } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { apiGet } from "@/lib/api"
import { formatMoney } from "@/lib/utils"

type AdminAnalytics = {
  totalUsers: number
  totalEquipment: number
  totalBookings: number
  pendingApprovals: number
  completedRentals: number
  totalRevenue: number
  currency: string
  monthlyBookings: Array<{
    _id: {
      year: number
      month: number
    }
    bookings: number
  }>
  monthlyRevenue: Array<{
    _id: {
      year: number
      month: number
    }
    revenue: number
  }>
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => apiGet<AdminAnalytics>("/api/admin/analytics", true),
    retry: 0
  })

  const months = (data?.monthlyBookings || []).map((x) => ({
    month: new Date(
      x._id.year,
      x._id.month - 1
    ).toLocaleDateString("en-US", {
      month: "short"
    }),
    bookings: x.bookings,
    revenue:
      data?.monthlyRevenue?.find(
        (r) =>
          r._id.year === x._id.year &&
          r._id.month === x._id.month
      )?.revenue || 0
  }))

  return (
    <>
      <PageTitle
        eyebrow="ADMIN CONTROL CENTER"
        title="Platform overview"
        description="Monitor marketplace activity, equipment approvals, rentals and revenue."
        action={
          <Button
            href="/dashboard/admin/equipment"
            variant="outline"
          >
            <ClipboardCheck size={16} />
            Review listings
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total users"
          value={isLoading ? "—" : data?.totalUsers ?? 0}
          icon={Users}
          accent
        />

        <StatCard
          label="Total equipment"
          value={isLoading ? "—" : data?.totalEquipment ?? 0}
          icon={Package}
        />

        <StatCard
          label="Total bookings"
          value={isLoading ? "—" : data?.totalBookings ?? 0}
          icon={CalendarDays}
        />

        <StatCard
          label="Pending approvals"
          value={isLoading ? "—" : data?.pendingApprovals ?? 0}
          icon={ShieldCheck}
        />

        <StatCard
          label="Completed rentals"
          value={isLoading ? "—" : data?.completedRentals ?? 0}
          icon={ClipboardCheck}
        />

        <StatCard
          label="Total revenue"
          value={
            isLoading
              ? "—"
              : formatMoney(
                  data?.totalRevenue ?? 0,
                  data?.currency?.toUpperCase() || "BDT"
                )
          }
          icon={Wallet}
        />
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="font-extrabold">
              Monthly booking volume
            </h2>

            <p className="mt-1 text-xs text-muted">
              Bookings created over the last six months
            </p>
          </div>

          <CardBody className="h-[300px] pt-5">
            {months.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={months}>
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

                  <Tooltip />

                  <Bar
                    dataKey="bookings"
                    fill="#f47732"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center text-sm text-muted">
                Monthly booking data will appear here.
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="font-extrabold">
              Revenue trend
            </h2>

            <p className="mt-1 text-xs text-muted">
              Verified paid transactions
            </p>
          </div>

          <CardBody className="h-[300px] pt-5">
            {months.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={months}>
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
                    formatter={(v) => formatMoney(Number(v))}
                  />

                  <Line
                    dataKey="revenue"
                    type="monotone"
                    stroke="#f47732"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#f47732"
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center text-sm text-muted">
                Revenue data will appear here.
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  )
}
