import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Create your account"
}

export default function RegisterPage() {
    return (
        <AuthCard
            title="Let’s get you moving."
            subtitle="Create your GearHub account and find the equipment your next project needs."
            footer={
                <>
                    Already have an account? <Link
                        href="/login"
                        className="font-bold text-(--orange)"
                    >
                        Sign in
                    </Link>
                </>
            }
        >
            <RegisterForm />
        </AuthCard>
    )
}
