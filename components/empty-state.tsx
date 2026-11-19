import { PackageSearch } from "lucide-react";

export function EmptyState({title, description}: {title: string; description: string}) {
    return <div
    className="rounded-2xl border border-dashed border-border px-6 py-16 text-center"
    >
        <span
        className="mx-auto grid size-14 place-items-center rounded-2xl bg-(--orange-soft) text-(--orange)"
        >
            <PackageSearch
            size={25}
            >

            </PackageSearch>

        </span>
        <h3
        className="mt-4 font-bold"
        >
            {title}

        </h3>
        <p
        className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted"
        >
            {description}

        </p>


    </div>
}