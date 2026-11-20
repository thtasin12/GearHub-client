"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import { useCurrentUser } from "@/lib/hooks";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Navbar() {
    const [open, setOpen] = useState(false);
    const { user } = useCurrentUser(); const router = useRouter();
    async function logout() {
        await authClient.signOut();
        toast.success("Signed out successfully");
        router.push("/"); router.refresh();
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-(--surface)/90 backdrop-blur-xl">

            <div className="container-shell flex h-19 items-center justify-between">
                <Logo />
                <nav className="hidden items-center gap-8 lg:flex">
                    {
                        NAV_LINKS.map((link) => <Link key={link.href} href={link.href} className="text-[13px] font-semibold text-muted transition hover:text-(--orange)">
                            {link.label}
                        </Link>)
                    }
                </nav>

                <div className="hidden items-center gap-2 md:flex">
                    <ThemeToggle />
                    {
                        user ? <>
                            <Button
                                href="/dashboard"
                                variant="outline"
                                size="md">
                                <LayoutDashboard size={16} />
                                Dashboard
                            </Button>
                            <button
                                onClick={logout}
                                className="grid size-10 place-items-center rounded-xl text-muted hover:bg-var(--surface-muted)">
                                <LogOut size={17} />
                            </button>
                        </> : <>
                            <Button
                                href="/login"
                                variant="ghost">
                                Log in
                            </Button>
                            <Button
                                href="/register">
                                Get started
                                <ChevronDown className="-rotate-90" size={15} />
                            </Button>
                        </>
                    }

                </div>

                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />

                    <button
                        onClick={() => setOpen(!open)}
                        className="grid size-10 place-items-center rounded-xl border border-border">
                        {open ? <X size={19} /> : <Menu size={19} />}
                    </button>
                </div>
            </div>


            {
                open && <div
                    className="border-t border-border bg-(--surface) px-5 py-5 md:hidden">
                    <div
                        className="flex flex-col gap-4">
                        {
                            NAV_LINKS.map((link) => <Link
                                onClick={() => setOpen(false)}
                                key={link.href}
                                href={link.href}
                                className="text-sm font-semibold">
                                {link.label}
                            </Link>)
                        }
                        {
                            user ? <Button
                                href="/dashboard">
                                Dashboard
                            </Button> : <div
                                className="grid grid-cols-2 gap-2">
                                <Button
                                    href="/login"
                                    variant="outline">
                                    Log in
                                </Button>
                                <Button
                                    href="/register">
                                    Sign up
                                </Button>
                            </div>}
                    </div>
                </div>}
        </header>
    )
}
