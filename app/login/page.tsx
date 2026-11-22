import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { PageLoader } from "@/components/page-loader";
import Link from "next/link";
export const metadata: Metadata = { title: "Sign in" };
export default function LoginPage() {
    return (
        <AuthCard
            title="Welcome back."
            subtitle="Sign in to continue managing your rentals, equipment and projects."
            footer={<>New to GearHub? <Link
                href="/register"
                className="font-bold text-(--orange)"
            >
                Create an account
            </Link>
            </>
            }
        >
            <Suspense
                fallback={<PageLoader />}
            >
                <LoginForm />
            </Suspense>
        </AuthCard>
    )
}
