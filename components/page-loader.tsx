export function PageLoader({label = "Loading GearHub"}: {label?: string}) {
    return <div
    className="flex min-h-[55vh] flex-col items-center justify-center gap-4"
    >
        <span
        className="size-10 animate-spin rounded-full border-[3px] border-border border-t-(--orange)"
        >

        </span>
        <p
        className="text-sm font-medium text-muted"
        >
            {label}

        </p>

    </div>
}