import Link from "next/link";
import { HardHat } from "lucide-react";

export function Logo({light = false}: {light?:boolean}) {
    return <Link
    href="/"
    className="inline-flex items-center gap-2.5"
    aria-label="GearHub home"
    >
        <span
        className="grid size-10 place-items-center rounded-xl bg-(--orange) text-white shadow-lg shadow-orange-500/20"
        >
            <HardHat
            size={22}
            strokeWidth={2.3}
            >

            </HardHat>

        </span>

        <span
        className={`text-[21px] font-black tracking-[-.06em] ${light ? "text-white" : "text-(--foreground)"}`}
        >
            Gear
            <span
            className="text-(--orange)"            >
                Hub


            </span>

            <span
            className="ml-0.5 text-[10px] font-bold tracking-[.18em] text-muted"
            >
                .BD

            </span>
        </span>
    
    </Link>
}