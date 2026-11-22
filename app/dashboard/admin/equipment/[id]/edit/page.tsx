
"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { PageTitle } from "@/components/dashboard/page-title"
import { Card, CardBody } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input, Label, Textarea } from "@/components/ui/field"

import { apiGet, apiPatch } from "@/lib/api"
import type { Equipment } from "@/lib/types"

export default function AdminEditEquipmentPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const qc = useQueryClient()

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin-equipment-edit-list"],
    queryFn: () => apiGet<Equipment[]>("/api/admin/equipment", true)
  })

  const item = items?.find((x) => x._id === id)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [image, setImage] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (item) {
      setName(item.name)
      setDescription(item.description)
      setPrice(String(item.rentalPrice))
      setQuantity(String(item.availableQuantity))
      setImage(item.image)
    }
  }, [item])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)

    try {
      await apiPatch(
        `/api/admin/equipment/${id}`,
        {
          name,
          description,
          rentalPrice: Number(price),
          availableQuantity: Number(quantity),
          image
        },
        true
      )

      toast.success("Equipment details updated")

      qc.invalidateQueries({
        queryKey: ["admin-equipment"]
      })

      router.push("/dashboard/admin/equipment")
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "Could not update equipment"
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageTitle
        eyebrow="ADMIN MODERATION"
        title="Edit listing details"
        description="Update listing information after reviewing the owner's submission."
      />

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
      ) : item ? (
        <Card>
          <CardBody>
            <form
              onSubmit={submit}
              className="max-w-2xl space-y-5"
            >
              <div>
                <Label>Equipment name</Label>

                <Input
                  required
                  minLength={3}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label>Description</Label>

                <Textarea
                  required
                  minLength={20}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Rental price (BDT)</Label>

                  <Input
                    required
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Available quantity</Label>

                  <Input
                    required
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Equipment image URL</Label>

                <Input
                  required
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={busy}
              >
                {busy ? "Saving…" : "Save listing changes"}
              </Button>
            </form>
          </CardBody>
        </Card>
      ) : (
        <p className="text-sm text-muted">
          This listing could not be found in the moderation queue.
        </p>
      )}
    </>
  )
}
