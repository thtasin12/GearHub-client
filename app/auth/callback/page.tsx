"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { PageLoader } from "@/components/page-loader"

export default function AuthCallbackPage() {
    const router = useRouter()
    const session = authClient.useSession()
    useEffect(() => {
        if (!session.isPending) {
            router.replace(session.data?.user ? "/dashboard" : "/login"

            )
        }
    }, [session.isPending, session.data?.user, router])
    return (
        <PageLoader
            label="Finishing secure sign in…" />
    )
}
