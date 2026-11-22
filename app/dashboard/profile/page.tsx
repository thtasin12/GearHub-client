
"use client"

import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Save } from "lucide-react"
import { toast } from "sonner"

import { PageTitle } from "@/components/dashboard/page-title"
import { Card, CardBody } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input, Label, Textarea } from "@/components/ui/field"

import { apiGet, apiPatch } from "@/lib/api"
import type { UserProfile } from "@/lib/types"
import { initials, formatDate } from "@/lib/utils"

export default function ProfilePage() {
  const qc = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiGet<UserProfile>("/api/profile", true)
  })

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [image, setImage] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setPhone(user.phone || "")
      setAddress(user.address || "")
      setImage(user.image || "")
    }
  }, [user])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)

    try {
      const body: {
        name: string
        phone: string
        address: string
        image?: string
      } = {
        name,
        phone,
        address
      }

      if (image) body.image = image

      await apiPatch("/api/profile", body, true)
      await qc.invalidateQueries({ queryKey: ["profile"] })

      toast.success("Profile updated")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update profile"
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageTitle
        eyebrow="ACCOUNT"
        title="Your profile"
        description="Keep your contact details up to date so owners can coordinate rentals with you."
      />

      {isLoading ? (
        <div className="h-80 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[.65fr_1.35fr]">
          <Card className="h-fit">
            <CardBody className="p-6 text-center">
              <div className="mx-auto grid size-20 place-items-center rounded-full bg-[var(--orange-soft)] text-xl font-black text-[var(--orange)]">
                {initials(user?.name)}
              </div>

              <h2 className="mt-4 font-extrabold">
                {user?.name}
              </h2>

              <p className="mt-1 text-xs text-muted">
                {user?.email}
              </p>

              <span className="mt-3 inline-flex rounded-full bg-[var(--surface-muted)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                {user?.role}
              </span>

              <div className="mt-6 border-t border-[var(--border)] pt-4 text-left">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                  Member since
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {formatDate(user?.createdAt)}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <h2 className="font-extrabold">
                Personal information
              </h2>

              <form
                onSubmit={save}
                className="mt-6 grid gap-5 sm:grid-cols-2"
              >
                <div>
                  <Label htmlFor="name">
                    Full name
                  </Label>

                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                  />
                </div>

                <div>
                  <Label htmlFor="email">
                    Email address
                  </Label>

                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="phone">
                    Phone number
                  </Label>

                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                  />
                </div>

                <div>
                  <Label htmlFor="image">
                    Profile image URL
                  </Label>

                  <Input
                    id="image"
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://…"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="address">
                    Address
                  </Label>

                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Your current address"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    disabled={busy}
                  >
                    {busy ? "Saving…" : "Save changes"}
                    <Save size={15} />
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      )}
    </>
  )
}
