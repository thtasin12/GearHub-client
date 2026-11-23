"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  CalendarDays,
  Heart,
  UserRound,
  Users,
  ClipboardList,
  MessageCircle,
  Bell,
  Scale,
  MapPin,
  LogOut,
  ChevronLeft,
  Menu,
  Search,
  ShieldCheck,
  Store
} from "lucide-react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { useCurrentUser } from "@/lib/hooks"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { PageLoader } from "@/components/page-loader"
import { Button } from "@/components/ui/button"
import { cn, initials } from "@/lib/utils"

const customerNav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My rentals", href: "/dashboard/rentals", icon: CalendarDays },
  { label: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { label: "Nearby equipment", href: "/dashboard/nearby", icon: MapPin },
  { label: "Compare equipment", href: "/dashboard/compare", icon: Scale },
  { label: "Messages", href: "/dashboard/messages", icon: MessageCircle },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Become an owner", href: "/dashboard/apply-owner", icon: Store },
  { label: "Profile", href: "/dashboard/profile", icon: UserRound }
]

const ownerNav = [
  { label: "Overview", href: "/dashboard/owner", icon: LayoutDashboard },
  { label: "My equipment", href: "/dashboard/owner/equipment", icon: Package },
  { label: "Add equipment", href: "/dashboard/owner/add-equipment", icon: PlusCircle },
  { label: "Rental requests", href: "/dashboard/owner/bookings", icon: CalendarDays },
  { label: "Availability planner", href: "/dashboard/availability", icon: CalendarDays },
  { label: "Messages", href: "/dashboard/messages", icon: MessageCircle },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Profile", href: "/dashboard/profile", icon: UserRound }
]

const adminNav = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "All users", href: "/dashboard/admin/users", icon: Users },
  { label: "Equipment review", href: "/dashboard/admin/equipment", icon: Package },
  { label: "All rentals", href: "/dashboard/admin/bookings", icon: ClipboardList },
  { label: "Owner applications", href: "/dashboard/admin/owner-applications", icon: ShieldCheck },
  { label: "Messages", href: "/dashboard/messages", icon: MessageCircle },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "My profile", href: "/dashboard/profile", icon: UserRound }
]

export function DashboardShell({
  children,
  allow
}: {
  children: React.ReactNode
  allow?: Array<"customer" | "owner" | "admin">
}) {
  const pathname = usePathname()
  const router = useRouter()

  const {
    session,
    sessionLoading,
    user,
    profileLoading,
    profileError,
    refreshProfile
  } = useCurrentUser()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [retrying, setRetrying] = useState(false)

  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      router.replace("/login?next=" + encodeURIComponent(pathname))
    }
  }, [sessionLoading, session?.user, router, pathname])

  useEffect(() => {
    if (!user) return

    const pathRole = pathname.startsWith("/dashboard/admin")
      ? "admin"
      : pathname.startsWith("/dashboard/owner") ||
          pathname.startsWith("/dashboard/availability")
        ? "owner"
        : [
            "/dashboard/rentals",
            "/dashboard/favorites",
            "/dashboard/compare",
            "/dashboard/nearby"
          ].some(
            (path) => pathname === path || pathname.startsWith(path + "/")
          )
          ? "customer"
          : undefined

    const permitted = allow ?? (pathRole ? [pathRole] : undefined)

    if (permitted && !permitted.includes(user.role)) {
      router.replace(
        user.role === "admin"
          ? "/dashboard/admin"
          : user.role === "owner"
            ? "/dashboard/owner"
            : "/dashboard"
      )
    }
  }, [user, allow, router, pathname])

  const nav = useMemo(
    () =>
      user?.role === "admin"
        ? adminNav
        : user?.role === "owner"
          ? ownerNav
          : customerNav,
    [user?.role]
  )

  if (
    sessionLoading ||
    !session?.user ||
    profileLoading ||
    (!user && !profileError)
  ) {
    return <PageLoader label="Preparing your workspace" />
  }

  if (!user) {
    return (
      <div className="grid min-h-screen place-items-center px-5 py-12">
        <div className="surface w-full max-w-lg rounded-3xl p-8 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-600">
            <Users size={25} />
          </div>

          <h1 className="mt-5 text-2xl font-black">
            Could not load your profile
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            {profileError ||
              "Your sign-in is active, but GearHub could not load your account details."}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              disabled={retrying}
              onClick={async () => {
                setRetrying(true)

                try {
                  await refreshProfile()
                } catch (error) {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : "Profile refresh failed"
                  )
                } finally {
                  setRetrying(false)
                }
              }}
            >
              {retrying ? "Retrying…" : "Try again"}
            </Button>

            <Button
              variant="outline"
              onClick={async () => {
                await authClient.signOut()
                router.replace("/login")
              }}
              
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    )
  }

  async function signOut() {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-[var(--border)] px-6">
          <Logo />

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden"
          >
            <ChevronLeft />
          </button>
        </div>

        <div className="px-5 py-6">
          <div className="rounded-2xl bg-[#14243c] px-4 py-4 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[.15em] text-orange-300">
              {user.role} workspace
            </p>

            <p className="mt-2 text-sm font-extrabold">
              Make your next move.
            </p>

            <p className="mt-1 text-[11px] leading-5 text-slate-300">
              Everything you need, in one place.
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))

            return (
              <Link
                onClick={() => setMobileOpen(false)}
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-semibold transition",
                  active
                    ? "bg-[var(--orange-soft)] text-[var(--orange)]"
                    : "text-muted hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-[var(--border)] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-[var(--surface-muted)] p-3">
            <div className="grid size-9 place-items-center rounded-full bg-[var(--orange)] text-xs font-black text-white">
              {initials(user.name)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold">
                {user.name}
              </p>

              <p className="truncate text-[10px] text-muted">
                {user.email}
              </p>
            </div>

            <button
              onClick={signOut}
              title="Sign out"
              className="text-muted hover:text-red-500"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <div className="min-h-screen lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="grid size-10 place-items-center rounded-xl border border-[var(--border)] lg:hidden"
            >
              <Menu size={18} />
            </button>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[var(--orange)]">
                GearHub workspace
              </p>

              <p className="text-sm font-bold">
                Welcome back, {user.name.split(" ")[0]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/equipment"
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-muted hover:bg-[var(--surface-muted)] sm:flex"
            >
              <Search size={15} />
              Explore
            </Link>

            <ThemeToggle />

            <div className="grid size-9 place-items-center rounded-full bg-[var(--orange-soft)] text-xs font-black text-[var(--orange)]">
              {initials(user.name)}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}