"use client"

import Image from "next/image"
import { useState, type FormEvent } from "react"
import { ArrowRight, Search, MapPin, CalendarDays, ShieldCheck, Sparkles, Calendar } from "lucide-react"
import { motion } from "motion/react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"


export function Hero() {
    const [search, setSearch] = useState("")
    const [city, setCity] = useState("")

    const router = useRouter()

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const query = new URLSearchParams()

        if (search.trim()) {
            query.set("search", search.trim())
        }

        if (city.trim()) {
            query.set("location", city.trim())
        }

        router.push(`/equipment?${query.toString()}`)
    }

    return (
        <section
            className="relative overflow-hidden bg-[#13243d] text-white"
        >
            <div
                className="hero-grid absolute inset-0 opacity-40"
            >

            </div>

            <div
                className="absolute -right-28 -top-48 size-150 rounded-full bg-orange-500/10 blur-[100px]"
            >

            </div>

            <div
                className="container-shell relative grid min-h-155 items-center gap-10 py-16 lg:grid-cols-[.95fr_1.04fr] lg:py-20"
            >
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65 }}
                    className="relative z-10"
                >
                    <div
                        className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.07] px-4 py-2 text-xs font-semibold text-orange-200"
                    >
                        <Sparkles
                            size={14}
                        >

                        </Sparkles>
                        The smarter way to rent equipment
                    </div>

                    <h1 
                    className="max-w-2xl text-[clamp(2.75rem,5.2vw,4.25rem)] font-black leading-[1.02] tracking-[-0.055em]"
                    >
                        Your next big <br />
                        project starts <br />
                        <span 
                        className="text-[#ff985d]"
                        >
                            with the right gear.
                        </span>
                    </h1>

                    <p
                        className="mt-7 max-w-lg text-base leading-8 text-slate-300"
                    >
                        Discover quality equipment from trusted owners near you. Book the tools you need, for exactly as long as you need  them.

                    </p>

                    <form
                        onSubmit={submit}
                        className="mt-9 flex-col flex gap-2 rounded-2xl border border-border bg-(--surface) p-2.5 shadow-2xl shadow-black/20 sm:flex-row sm:items-center"
                    >
                        <div
                            className="hero-search-segment flex min-w-0 flex-[1.35] items-center gap-3 rounded-xl px-3 py-3 text-(--foreground)"
                        >
                            <Search
                                size={19}
                                className="shrink-0 text-orange-500"
                            ></Search>

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="hero-search-input  min-w-0 flex-1 bg-transparent text-sm font-medium text-(--foreground) placeholder:text-(--muted)"
                                aria-label="Search equipment"
                                placeholder="Equipment name"
                            />

                        </div>

                        <div
                            className="hidden h-9 w-px shrink-0 bg-(--border) sm:block"
                        >

                        </div>

                        <div
                            className="hero-search-segment flex min-w-0 flex-[0.9] items-center gap-3 rounded-xl px-3 py-3 text-(--foreground)"
                        >
                            <MapPin
                                size={18}
                                className="shrink-0 text-orange-500"
                            ></MapPin>

                            <input
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="hero-search-input min-w-0 flex-1 bg-transparent text-sm font-medium text-(--foreground) placeholder:text-(--muted)"
                                placeholder="City or area"
                                aria-label="location"
                            />

                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full shrink-0 rounded-xl sm:w-auto"
                        >
                            Find Equipment

                        </Button>

                    </form>

                    <div
                        className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-300"
                    >
                        <span
                            className="flex items-center gap-2"
                        >
                            <ShieldCheck
                                className="text-orange-300"
                                size={15}
                            ></ShieldCheck>

                            Verified equipment owners

                        </span>

                        <span
                            className="flex items-center gap-2"
                        >
                            <CalendarDays
                                size={15}
                                className="text-orange-300"
                            >

                            </CalendarDays>
                            Flexible rental Periods
                        </span>

                    </div>

                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.96, x: 22 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.12 }}
                    className="relative mx-auto w-full max-w-162.5"
                >
                    <div className="absolute -inset-3 rounded-[34px] bg-linear-to-br from-orange-400/35 to-transparent blur-xl" />

                    <div className="relative aspect-[1.13] overflow-hidden rounded-[30px] border border-white/15 bg-[#243650] shadow-2xl">
                        <Image
                            src="/images/photo.avif"
                            alt="Heavy construction excavator at a project site"
                            fill
                            priority
                            unoptimized
                            className="object-cover"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-[#0c192b]/80 via-transparent to-[#0c192b]/10" />

                        <div className="absolute bottom-13 left-5 right-5 flex items-end justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-orange-200">
                                    Built for every ambition
                                </p>

                                <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                                    Make your move.
                                </h2>
                            </div>

                            <span className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold backdrop-blur">
                                Explore equipment
                            </span>
                        </div>
                    </div>

                    <div className="absolute -bottom-8 -left-5 hidden rounded-2xl border border-white/15 bg-[#1d304a] p-4 shadow-xl sm:block">
                        <div className="flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300">
                                <ShieldCheck size={21} />
                            </span>

                            <div>
                                <p className="text-sm font-extrabold">
                                    Trusted owners
                                </p>

                                <p className="text-[10px] text-slate-300">
                                    Clear listing details
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -right-4 top-10 hidden rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl dark:border-white/10 dark:bg-[#1B2D47] dark:text-white sm:block">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-300">
                            Trusted by teams
                        </p>

                        <p className="mt-1 text-xl font-black">
                            One place
                        </p>

                        <p className="text-[10px] text-slate-500 dark:text-slate-300">
                            For every project
                        </p>
                    </div>
                </motion.div>

            </div>

        </section>
    )
}