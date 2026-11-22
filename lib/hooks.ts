
"use client"

import { useEffect, useState } from "react"

import { authClient } from "./auth-client"
import type { UserProfile } from "./types"
import { apiGet } from "./api"

export function useCurrentUser() {
  const session = authClient.useSession()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    if (!session.data?.user) {
      setProfile(null)
      setProfileError(null)
      setProfileLoading(false)

      return () => {
        active = false
      }
    }

    setProfileLoading(true)
    setProfileError(null)

    apiGet<UserProfile>("/api/profile", true)
      .then((data) => {
        if (active) {
          setProfile(data)
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setProfile(null)

          setProfileError(
            error instanceof Error
              ? error.message
              : "Could not load your GearHub profile."
          )
        }
      })
      .finally(() => {
        if (active) {
          setProfileLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [session.data?.user?.id, session.data?.session?.id])

  async function refreshProfile() {
    setProfileLoading(true)
    setProfileError(null)

    try {
      const data = await apiGet<UserProfile>("/api/profile", true)

      setProfile(data)

      return data
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? error.message
          : "Could not load your GearHub profile."
      )

      throw error
    } finally {
      setProfileLoading(false)
    }
  }

  return {
    session: session.data,
    sessionLoading: session.isPending,
    user: profile,
    profileLoading,
    profileError,
    refreshProfile
  }
}
