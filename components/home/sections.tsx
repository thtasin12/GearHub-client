"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarCheck, Clock3, CreditCard, Headphones, Truck, Search, Star } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { EquipmentCard } from "@/components/equipment-card";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { CATEGORIES, DEMO_EQUIPMENT } from "@/lib/constants";
import type { Equipment } from "@/lib/types";

export function FeaturedSection() {
    const { data, isLoading } = useQuery({
        queryKey: ["featured-equipment"],
        queryFn: () => apiGet<Equipment[]>("/api/equipment/featured?limit=6"),
        retry: 0
    })
    const items = data ?? (isLoading ? [] : DEMO_EQUIPMENT as unknown as Equipment[])

    return (
        <section
            className="container-shell py-24">
            <div
                className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <SectionHeading
                    eyebrow="Handpicked for you"
                    title="Gear that gets the job done."
                    description="Explore reliable equipment from experienced owners. Every listing is built around clear pricing and flexible rental terms."
                />
                <Button
                    href="/equipment"
                    variant="outline">
                    Browse all equipment
                    <ArrowUpRight size={16}
                    ></ArrowUpRight>
                </Button>
            </div>
            {
                isLoading && !data ? <div
                    className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {
                        [1, 2, 3].map(n => <div
                            key={n}
                            className="h-97.5 animate-pulse rounded-2xl bg-(--surface-muted)" />
                        )
                    }
                </div> : <div
                    className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {
                        items.slice(0, 6).map((item, i) => <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * .06 }}>
                            <EquipmentCard
                                item={item} ></EquipmentCard>
                        </motion.div>
                        )
                    }
                </div>
            }
        </section>
    )
}

export function CategoriesSection() {
    return (
        <section
            id="categories"
            className="bg-(--surface) py-24">
            <div
                className="container-shell">
                <div
                    className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <SectionHeading
                        eyebrow="Find your category"
                        title="The right tools for every kind of work."
                        description="From a weekend project to a major build, explore equipment across the categories that keep ideas moving." />
                    <Link
                        href="/equipment"
                        className="inline-flex items-center gap-2 text-sm font-bold text-(--orange)">
                        All categories
                        <ArrowRight size={16}></ArrowRight>
                    </Link>
                </div>
                <div
                    className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {
                        CATEGORIES.map((category, i) => <motion.div
                            key={category.name}
                            initial={{
                                opacity: 0,
                                y: 16
                            }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * .05 }}>
                            <Link
                                href={`/equipment?category=${encodeURIComponent(category.name)}`}
                                className="group block">
                                <div
                                    className="relative aspect-[.88] overflow-hidden rounded-2xl bg-slate-200">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        unoptimized
                                        className="object-cover transition duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/10 to-transparent" >

                                    </div>
                                    <div
                                        className="absolute inset-x-3 bottom-3">
                                        <p
                                            className="text-xs font-bold leading-5 text-white">
                                            {
                                                category.name.replace(" & ", " &\n")
                                            }
                                        </p>
                                        <p className="mt-1 text-[10px] text-slate-300">
                                            Browse equipment
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                        )
                    }
                </div>
            </div>
        </section>
    )
}


export function WhySection() {
    const items = [{
        icon: BadgeCheck,
        title: "Trusted owners",
        desc: "Transparent profiles and clear listing details make it easier to rent with confidence."
    },
    {
        icon: CreditCard,
        title: "Secure checkout",
        desc: "A protected payment flow with Stripe Checkout and clear payment records."
    },
    {
        icon: Clock3,
        title: "Flexible rentals",
        desc: "Choose a rental period that matches your work and your schedule."
    },
    {
        icon: Headphones,
        title: "People-first support",
        desc: "Get help when you need it, from booking through equipment return."
    }
    ]
    return (
        <section
            className="container-shell py-24">
            <div
                className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
                <div>
                    <SectionHeading
                        eyebrow="Why GearHub"
                        title="More access. Less hassle. Better work."
                        description="We bring equipment owners and people who need the right tools together in one simple, transparent marketplace." />
                    <div
                        className="mt-8 flex items-center gap-4">
                        <div
                            className="flex -space-x-3">
                            {
                                [1, 2, 3, 4].map((n) => <span
                                    key={n}
                                    className="grid size-10 place-items-center rounded-full border-2 border-(--background) bg-slate-300 text-xs font-bold text-slate-700"
                                >{
                                        ["AR", "SM", "TN", "+"][n - 1]
                                    }
                                </span>)
                            }
                        </div>
                        <div>
                            <p
                                className="text-sm font-bold"
                            >
                                Built around real people
                            </p>
                            <p
                                className="text-xs text-muted"
                            >Renters, creators and local businesses
                            </p>
                        </div>
                    </div>
                </div>
                <div
                    className="grid gap-4 sm:grid-cols-2"
                >
                    {
                        items.map((item, i) => <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * .06 }}
                            className="surface rounded-2xl p-6"
                        >
                            <span
                                className="grid size-12 place-items-center rounded-xl bg-(--orange-soft) text-(--orange)]"
                            >
                                <item.icon
                                    size={23} />
                            </span>
                            <h3
                                className="mt-5 text-base font-extrabold">
                                {item.title}
                            </h3>
                            <p
                                className="mt-2 text-sm leading-6 text-muted">
                                {item.desc}
                            </p>
                        </motion.div>)
                    }
                </div>
            </div>
        </section>
    )
}


export function HowItWorks() {
    const steps = [{
        n: "01",
        icon: Search,
        title: "Find what you need",
        desc: "Search by equipment, category or location and compare your options."
    },
    {
        n: "02",
        icon: CalendarCheck,
        title: "Choose your dates",
        desc: "Pick your rental period, confirm availability and share delivery details."
    },
    {
        n: "03",
        icon: CreditCard,
        title: "Pay securely",
        desc: "Complete checkout through Stripe and receive your booking confirmation."
    },
    {
        n: "04",
        icon: Truck,
        title: "Get to work",
        desc: "Coordinate pickup or delivery, then return the gear on time."
    }
    ]
    return (
        <section
            id="how-it-works"
            className="bg-[#13243d] py-24 text-white"
        >
            <div
                className="container-shell">
                <SectionHeading
                    eyebrow="Simple by design"
                    title="From search to start-up in four steps."
                    description="A straightforward rental experience, with the important details made clear at every step."
                />
                <div
                    className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {
                        steps.map((s, i) => <motion.div
                            key={s.n}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * .08 }}
                            className="relative rounded-2xl border border-white/10 bg-white/5.5 p-6"
                        >
                            <div
                                className="flex items-center justify-between"
                            >
                                <span
                                    className="text-3xl font-black tracking-tight text-orange-300/70"
                                >
                                    {s.n}
                                </span>
                                <span
                                    className="grid size-11 place-items-center rounded-xl bg-orange-500/15 text-orange-300">
                                    <s.icon
                                        size={21}
                                    />
                                </span>
                            </div>
                            <h3
                                className="mt-7 font-extrabold">
                                {s.title}
                            </h3>
                            <p
                                className="mt-2 text-sm leading-6 text-slate-300"
                            >
                                {s.desc}
                            </p>
                            {
                                i !== 3 && <ArrowRight
                                    className="absolute -right-4 top-1/2 z-10 hidden text-orange-300 lg:block"
                                    size={21}></ArrowRight>
                            }
                        </motion.div>)
                    }
                </div>
            </div>
        </section>
    )
}
export function OwnerCTA() {
    return (
        <section
            id="owners"
            className="container-shell py-24"
        >
            <div
                className="relative overflow-hidden rounded-[30px] bg-[#f47732] px-7 py-12 text-white sm:px-12 lg:px-16"
            >
                <div
                    className="absolute -right-10 -top-32 size-96 rounded-full border-55 border-white/10"
                >
                </div>
                <div
                    className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"
                >
                    <div>
                        <p
                            className="text-xs font-extrabold uppercase tracking-[.17em] text-white/75"
                        >
                            For equipment owners
                        </p>
                        <h2
                            className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-[-.045em] sm:text-4xl"
                        >
                            Your equipment can do more when it works for everyone.
                        </h2>
                        <p
                            className="mt-4 max-w-xl text-sm leading-7 text-white/85"
                        >
                            List your equipment, manage bookings and turn idle time into an opportunity.
                        </p>
                    </div>
                    <Button
                        href="/register"
                        variant="navy"
                        size="lg"
                        className="relative"
                    >
                        Start earning with GearHub
                        <ArrowRight
                            size={17}
                        />
                    </Button>
                </div>
            </div>
        </section>
    )
}
export function ReviewsSection() {
    const reviews = [{
        name: "Nafis Rahman",
        role: "Construction lead",
        quote: "We found a reliable excavator for a short project without dealing with a long procurement process.",
        rating: "5.0",
        avatar: "NR"
    },
    {
        name: "Mehjabin Sultana",
        role: "Creative producer",
        quote: "The rental details were clear, the owner was responsive, and the camera kit arrived ready to use.",
        rating: "5.0",
        avatar: "MS"
    },
    {
        name: "Imran Hossain",
        role: "Small business owner",
        quote: "A useful platform for finding equipment at the time you need it. The booking flow is simple.",
        rating: "4.9",
        avatar: "IH"
    },
    {
        name: "Farhana Akter",
        role: "Event coordinator",
        quote: "Having equipment options and rental details in one place makes planning an event much easier.",
        rating: "5.0",
        avatar: "FA"
    }
    ]
    return (
        <section
            className="container-shell py-24"
        >
            <div
                className="text-center"
            >
                <SectionHeading
                    align="center"
                    eyebrow="Stories from the field"
                    title="Good work starts with good gear."
                    description="Hear from the people who use GearHub to keep projects moving."
                />
            </div>
            <div
                className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
            >
                {
                    reviews.map((r, i) => <motion.div
                        key={r.name}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * .08 }}
                        className="surface rounded-2xl p-6"
                    >
                        <div
                            className="flex gap-1 text-amber-500"
                        >
                            {
                                [1, 2, 3, 4, 5].map(n => <Star
                                    key={n}
                                    size={14}
                                    fill="currentColor"
                                />)
                            }
                        </div>
                        <p
                            className="mt-5 text-sm leading-7 text-muted">
                            “{r.quote}”
                        </p>
                        <div
                            className="mt-7 flex items-center gap-3"
                        >
                            <span
                                className="grid size-10 place-items-center rounded-full bg-(--orange-soft) text-xs font-black text-(--orange)"
                            >
                                {r.avatar}
                            </span>
                            <div
                                className="flex-1"
                            >
                                <p
                                    className="text-sm font-bold"
                                >
                                    {r.name}
                                </p>
                                <p
                                    className="text-xs text-muted"
                                >
                                    {r.role}
                                </p>
                            </div>
                            <span
                                className="text-xs font-extrabold"
                            >
                                {r.rating}
                            </span>
                        </div>
                    </motion.div>
                    )
                }
            </div>
        </section>
    )
}
