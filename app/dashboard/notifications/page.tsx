
"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Bell, CheckCheck, ArrowUpRight } from "lucide-react"
import { toast } from "sonner"

import { PageTitle } from "@/components/dashboard/page-title"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"

import { apiGet, apiPatch } from "@/lib/api"
import { formatDate } from "@/lib/utils"

type Notification = {
  _id: string
  type: string
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      apiGet<{
        items: Notification[]
        unread: number
        pagination: unknown
      }>("/api/notifications?page=1&limit=100", true)
  })

  async function mark(id: string) {
    try {
      await apiPatch(`/api/notifications/${id}/read`, { read: true }, true)

      qc.invalidateQueries({ queryKey: ["notifications"] })
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "Could not update notification"
      )
    }
  }

  async function all() {
    try {
      await apiPatch("/api/notifications/read-all", {}, true)

      qc.invalidateQueries({ queryKey: ["notifications"] })
      toast.success("All notifications marked as read")
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "Could not update notifications"
      )
    }
  }

  return (
    <>
      <PageTitle
        eyebrow="UPDATES"
        title="Notifications"
        description="Booking updates, payment confirmations and messages from your GearHub workspace."
        action={
          <Button onClick={all} variant="outline">
            <CheckCheck size={15} />
            Mark all as read
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-2 text-xs text-muted">
        <Bell size={15} />
        {data?.unread ?? 0} unread notifications
      </div>

      {isLoading ? (
        <div className="h-60 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
      ) : data?.items.length ? (
        <Card className="divide-y divide-[var(--border)]">
          {data.items.map((n) => (
            <div
              key={n._id}
              className={`flex items-start gap-4 p-5 ${
                n.read ? "" : "bg-[var(--orange-soft)]/35"
              }`}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--surface-muted)] text-[var(--orange)]">
                <Bell size={18} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold">
                    {n.title}
                  </h3>

                  {!n.read && (
                    <span className="size-2 rounded-full bg-[var(--orange)]" />
                  )}
                </div>

                <p className="mt-1 text-xs leading-6 text-muted">
                  {n.message}
                </p>

                <p className="mt-2 text-[10px] text-muted">
                  {formatDate(n.createdAt, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>

              <div className="flex gap-2">
                {n.link && (
                  <Button
                    href={n.link}
                    variant="ghost"
                    size="sm"
                  >
                    <ArrowUpRight size={14} />
                  </Button>
                )}

                {!n.read && (
                  <Button
                    onClick={() => mark(n._id)}
                    variant="outline"
                    size="sm"
                  >
                    Mark read
                  </Button>
                )}
              </div>
            </div>
          ))}
        </Card>
      ) : (
        <EmptyState
          title="You’re all caught up"
          description="New booking and payment updates will appear here."
        />
      )}
    </>
  )
}
