export function PageTitle({ eyebrow = "WORKSPACE", title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
    return (
        <div
            className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"
        >
            <div>
                <p
                    className="section-kicker"
                >
                    {eyebrow}
                </p>
                <h1
                    className="mt-2 text-3xl font-black tracking-[-.05em] sm:text-[34px]"
                >
                    {title}
                </h1>

                {
                    description && <p
                        className="mt-2 max-w-2xl text-sm leading-6 text-muted"
                    >
                        {description}
                    </p>
                }
            </div>
            {action}
        </div>
    )
}
