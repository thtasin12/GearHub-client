
"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { PageTitle } from "@/components/dashboard/page-title"
import { Card, CardBody } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Input,
  Label,
  Select,
  Textarea
} from "@/components/ui/field"

import { apiGet, apiPatch } from "@/lib/api"
import { CATEGORIES } from "@/lib/constants"
import type { Equipment } from "@/lib/types"

export default function EditEquipmentPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["owner-equipment-item", id],
    queryFn: () => apiGet<Equipment>(`/api/owner/equipment/${id}`, true)
  })

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Construction Equipment",
    city: "",
    address: "",
    latitude: "",
    longitude: "",
    rentalPrice: "",
    rentalType: "daily",
    availableQuantity: "1",
    condition: "Good",
    brand: "",
    model: "",
    image: "",
    rentalTerms: ""
  })

  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name,
        description: data.description,
        category: data.category,
        city: data.location?.city || "",
        address: data.location?.address || "",
        latitude: String(
          (
            data.location as unknown as {
              geo?: {
                coordinates?: number[]
              }
            }
          )?.geo?.coordinates?.[1] ?? ""
        ),
        longitude: String(
          (
            data.location as unknown as {
              geo?: {
                coordinates?: number[]
              }
            }
          )?.geo?.coordinates?.[0] ?? ""
        ),
        rentalPrice: String(data.rentalPrice),
        rentalType: data.rentalType,
        availableQuantity: String(data.availableQuantity),
        condition: data.condition,
        brand: data.brand || "",
        model: data.model || "",
        image: data.image,
        rentalTerms: ""
      })
    }
  }, [data])

  function change(key: string, value: string) {
    setForm((p) => ({
      ...p,
      [key]: value
    }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)

    try {
      await apiPatch(
        `/api/equipment/${id}`,
        {
          name: form.name,
          description: form.description,
          category: form.category,
          location: {
            city: form.city,
            address: form.address,
            country: "Bangladesh",
            ...(form.latitude.trim() && form.longitude.trim()
              ? {
                  latitude: Number(form.latitude),
                  longitude: Number(form.longitude)
                }
              : {})
          },
          rentalPrice: Number(form.rentalPrice),
          rentalType: form.rentalType,
          availableQuantity: Number(form.availableQuantity),
          condition: form.condition,
          brand: form.brand,
          model: form.model,
          image: form.image,
          rentalTerms: form.rentalTerms
        },
        true
      )

      toast.success("Equipment updated and sent for re-approval")

      qc.invalidateQueries({
        queryKey: ["owner-equipment"]
      })

      router.push("/dashboard/owner/equipment")
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
        eyebrow="OWNER"
        title="Update equipment"
        description="Editing a listing sends it back to admin review."
      />

      {isLoading ? (
        <div className="h-72 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
      ) : (
        <Card>
          <CardBody>
            <form
              onSubmit={submit}
              className="grid gap-4 md:grid-cols-2"
            >
              {(
                [
                  "name",
                  "description",
                  "category",
                  "condition",
                  "brand",
                  "model",
                  "city",
                  "address",
                  "latitude",
                  "longitude",
                  "rentalPrice",
                  "rentalType",
                  "availableQuantity",
                  "image",
                  "rentalTerms"
                ] as const
              ).map((key) => {
                const label = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (c) => c.toUpperCase())

                return (
                  <div
                    key={key}
                    className={
                      key === "description" || key === "rentalTerms"
                        ? "md:col-span-2"
                        : ""
                    }
                  >
                    <Label>{label}</Label>

                    {key === "description" || key === "rentalTerms" ? (
                      <Textarea
                        value={form[key]}
                        onChange={(e) => change(key, e.target.value)}
                        required={key === "description"}
                      />
                    ) : key === "category" ? (
                      <Select
                        value={form.category}
                        onChange={(e) => change(key, e.target.value)}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.name}>
                            {c.name}
                          </option>
                        ))}

                        <option>Other</option>
                      </Select>
                    ) : key === "condition" ? (
                      <Select
                        value={form.condition}
                        onChange={(e) => change(key, e.target.value)}
                      >
                        {["New", "Like New", "Good", "Fair"].map((v) => (
                          <option key={v}>
                            {v}
                          </option>
                        ))}
                      </Select>
                    ) : key === "rentalType" ? (
                      <Select
                        value={form.rentalType}
                        onChange={(e) => change(key, e.target.value)}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </Select>
                    ) : (
                      <Input
                        required={
                          !["brand", "model", "rentalTerms"].includes(key)
                        }
                        type={
                          key === "rentalPrice" ||
                          key === "availableQuantity" ||
                          key === "latitude" ||
                          key === "longitude"
                            ? "number"
                            : key === "image"
                              ? "url"
                              : "text"
                        }
                        step={
                          key === "latitude" || key === "longitude"
                            ? "any"
                            : undefined
                        }
                        min={
                          key === "rentalPrice" ||
                          key === "availableQuantity"
                            ? 1
                            : undefined
                        }
                        value={form[key]}
                        onChange={(e) => change(key, e.target.value)}
                      />
                    )}
                  </div>
                )
              })}

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  disabled={busy}
                >
                  {busy ? "Saving…" : "Save equipment changes"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}
    </>
  )
}
