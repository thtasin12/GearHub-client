"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, MapPin, Star, ArrowUpRight } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import type { Equipment } from "@/lib/types"
import { formatMoney } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
authClient
import { apiPost } from "@/lib/api"
import { Button } from "./ui/button"

export function EquipmentCard({
    item, compact = false
}: {item: Equipment; compact?: boolean}) {
    const [saved, setSaved] = useState(false)
    const [busy, setBusy] = useState(false)
    const session = authClient.useSession()
    async function favorite() {
        if(!session.data?.user) {
            toast.info("Sign in to save equipment.")
            return
        }
        if(item._id.startsWith("demo-")) {
            toast.info("Demo listing cannot be saved.")
            return
        }
        setBusy(true)
        try {
            if(saved) {
                const {apiDelete} = await import("@/lib/api")
                await apiDelete(`/api/fovarits/${item._id}`)
                setSaved(false)
                toast.success("Removed from favrorites")
            }
            else {
                await apiPost(`/api/favorites/${item._id}`, undefined, true)
                setSaved(true)
                toast.success("Add to favorites")
            }
        }
        catch(error) {
            toast.error(error instanceof Error ? error.message : "Could not update favorites")
    
        }
        finally {
            setBusy(false)
        }
    }

    return(
        <article
        className="group rounded-2xl border border-border br-(--surface) transition duration-300 hover:-translate-y-1 hover:shadow-(--shadow) overflow-hidden"
        >
            <div
            className="relative aspect-[1.45] overflow-hidden bg-(--surface-muted"
            >
                <Image
                src={item.image || "https://images.unsplash.com/photo-1580901368919-7738efb0f87e"}
                alt={item.name}
                fill unoptimized
                className="object-cover transition duration-500 group-hover:scale-105"
                >


                </Image>

                <div
                className="left-3 top-3 rounded-full bg-white/95 px-3 py1 text-[10px] font bold text-slate-700 shadow-sm absolute"
                >
                    {
                        item._id.startsWith("demo-") ? "SAMPLE PREVIEW" : item.category?.split(" ")[0]
                    }

                </div>

                <button
                disabled={busy}
                onClick={favorite}
                aria-label="Save equipment"
                className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/95 text-slate-600 shadow-sm transition hover:text-rose-500 disabled:opacity-500"
                >
                    <Heart
                    size={17}
                    fill={saved ? "currentColor" : "none"}
                    className={saved ? "text-rose-500" : ""}
                    >
                        
                    </Heart>

                </button>

            </div>

            <div
            className="p-4"
            >
                <div
                className="flex items-center gap-1 text-xs font-semibold text-amber-500"
                >
                    <Star
                    size={13}
                    fill="currentColor"
                    >

                    </Star>
                    {
                        Number(item.averageRating || 4.8).toFixed(1)
                    }

                    <span
                    className="font-normal text-muted"
                    >
                        ({
                            item.reviewCount || 0
                        } reviews)

                    </span>

                </div>

                <Link
                href={`/equipment/${item._id}`}
                className="mt-2 block min-h-12 text-[15px] font-bold leading-6 text-(--foreground) transition hover:text-(--orange)"
                >
                    {item.name}
                
                </Link>

                <p
                className="mt-2 flex items-center gap-1.5 text-xs text-muted"
                >
                    <MapPin
                    size={13}
                    >

                    </MapPin>

                    {item.location?.city || "Bangladesh"}

                </p>

                <div
                className="mt-4 flex items-end justify-between border-t border-(--border) pt-4"
                >
                    <div>
                        <p
                        className="text-[10px] font-semibold uppercase tracking-wide text-muted"
                        >
                            Starting from

                        </p>

                        <p
                        className="mt-0.5 text-lg font-extrabold text-(--foreground)"
                        >
                            {
                                formatMoney(item.rentalPrice)
                            }
                            <span
                            className="ml-1 text-[10px] font-medium text-muted"
                            >
                                / {
                                    item.rentalType?.slice(0, -2) === "week" ? "week" : item.rentalType?.slice(0, -2) === "month" ? "month" : "day"
                                }

                            </span>

                        </p>
                    </div>

                    <Button
                    href={`/equipment/${item._id}`}
                    size="sm"
                    className="rounded-lg"
                    >
                        view details
                        <ArrowUpRight
                        size={14}
                        >

                        </ArrowUpRight>

                    </Button>

                </div>
            </div>

        </article>
    )
}