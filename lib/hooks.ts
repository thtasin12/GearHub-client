"use client"
import { useEffect, useState } from "react";
import { authClient } from "./auth-client";
import { UserProfile } from "./types";
import { apiGet } from "./api";
import { finalizeBundlerFromConfig } from "next/dist/lib/bundler";

export function useCurrentUser() {
    const session = authClient.useSession()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [profileLoading, setProfileLeading] = useState(false)
    const [profileError, setProfileError] = useState<string | null>(null)

    useEffect(() => {
        let active = true
        if(!session.data?.user) {
            setProfile(null)
            setProfileError(null)
            setProfileLeading(false)
            return
        }
        setProfileLeading(true)
        setProfileError(null)
        apiGet<UserProfile>("/api/profile", true)
        .then((data) => {
            if(active){
                setProfile(data)
            }
        })
        .catch((error: unknown) => {
            if(active) {
                setProfile(null)
                setProfileError(error instanceof Error ? error.message : "Could not load your GearHub Profile.")
            }
        })
    }, [session.data?.user?.id, session.data?.session?.id])

    return {
        session: session.data,
        sessionLoading: session.isPending,
        user: profile,
        profileLoading,
        profileError,
        refreshProfile: async() => {
            setProfileError(null)
            try {
                const data = await apiGet<UserProfile>("/api/profile", true)
                setProfile(data)
                return data
            }
            catch(error) {
                setProfileError(error instanceof Error ? error.message : "Could not load your GearHub profile.")
                throw error
            }
            finally {
                setProfileLeading(false)
            }
        }
    }
}