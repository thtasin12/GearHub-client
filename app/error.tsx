"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error])
    return (
        <div
            className="grid min-h-screen place-items-center px-5"
        >
            <div
                className="max-w-md text-center"
            >
                <p
                    className="section-kicker"
                >
                    Something went wrong
                </p>
                <h1
                    className="mt-3 text-3xl font-black"
                >
                    That didn’t go to plan.
                </h1>
                <p
                    className="mt-3 text-sm leading-7 text-muted"
                >
                    The page hit an unexpected error. Please retry, or return to GearHub home.
                </p>
                <div
                    className="mt-7 flex justify-center gap-3"
                >
                    <Button
                        onClick={reset}
                    >
                        Try again
                    </Button>
                    <Button
                        href="/"
                        variant="outline"
                    >
                        Go home
                    </Button>
                </div>
            </div>
        </div>
    )
}
