export function SectionHeading({eyebrow, title, description, align="left"}:{eyebrow: string; title: string; description?:string; align?:"left" | "center"}) {
    return <div
    className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
    >
        <p
        className="section-kicker"
        >
            {eyebrow}

        </p>

        <h2
        className="section-title mt-3"
        >
            {title}

        </h2>

        {
            description && <p
            className="mt-4 text-sm leading-7 text-muted sm:text-base"
            >
                {description}
            </p>
        }

    </div>
}