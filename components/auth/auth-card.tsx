import Link from "next/link";
import { Logo } from "@/components/logo";

export function AuthCard({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
    return (
        <main
            className="grid min-h-screen bg-(--background) lg:grid-cols-2"
        >
            <section
                className="relative hidden overflow-hidden bg-[#14243c] p-12 text-white lg:flex lg:flex-col lg:justify-between"
            >
                <div
                    className="hero-grid absolute inset-0 opacity-40"
                >
                </div>
                <div
                    className="absolute -bottom-48 -left-32 size-135 rounded-full bg-orange-500/15 blur-[110px]">
                </div>
                <div
                    className="relative"
                >
                    <Logo light />
                    <div
                        className="mt-32 max-w-xl"
                    >
                        <span
                            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-orange-200"
                        >
                            Your work. Your way.
                        </span>
                        <h1
                            className="mt-7 text-5xl font-black leading-[1.04] tracking-[-.06em]"
                        >
                            Good equipment
                            <br />
                            opens up <span
                                className="text-orange-300"
                            >
                                new possibilities.
                            </span>
                        </h1>
                        <p
                            className="mt-6 max-w-md text-sm leading-7 text-slate-300"
                        >
                            Find the right tools, work with trusted local owners, and keep your projects moving with GearHub.
                        </p>
                    </div>
                </div>
                <div
                    className="relative flex items-center gap-3 text-xs text-slate-400"
                >
                    <span
                        className="grid size-9 place-items-center rounded-xl bg-white/10 text-orange-300"
                    >
                        GH
                    </span>
                    Built for makers, teams and doers across Bangladesh.
                </div>
            </section>
            <section
                className="flex items-center justify-center px-5 py-12 sm:px-10"
            >
                <div className="w-full max-w-110"
                >
                    <div
                        className="mb-9 lg:hidden"
                    >
                        <Logo />
                    </div>
                    <div>
                        <p
                            className="section-kicker"
                        >
                            Welcome to GearHub
                        </p>
                        <h2
                            className="mt-3 text-3xl font-black tracking-tighter"
                        >
                            {title}
                        </h2>
                        <p
                            className="mt-2 text-sm leading-6 text-muted"
                        >
                            {subtitle}
                        </p>
                    </div>
                    <div
                        className="mt-8"
                    >
                        {children}
                    </div>
                    <div
                        className="mt-7 text-center text-sm text-muted"
                    >
                        {footer}
                    </div>
                    <p
                        className="mt-10 text-center text-[11px] text-muted"
                    >
                        By continuing, you agree to our <Link
                            href="#"
                            className="font-semibold text-(--orange)"
                        >
                            Terms
                        </Link> and <Link
                            href="#"
                            className="font-semibold text-(--orange)"
                        >
                            Privacy Policy
                        </Link>.
                    </p>
                </div>
            </section>
        </main>
    )
}
