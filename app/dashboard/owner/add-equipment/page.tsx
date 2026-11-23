"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  UploadCloud,
  ImagePlus,
  CheckCircle2
} from "lucide-react"
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import { CATEGORIES } from "@/lib/constants"
import { apiPost } from "@/lib/api"

export default function AddEquipmentPage() {
  const router = useRouter()

  const [busy, setBusy] = useState(false)
  const [image, setImage] = useState("")
  const [draftImage, setDraftImage] = useState("")
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imagePreviewError, setImagePreviewError] = useState(false)

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
    rentalTerms: "Please handle the equipment carefully and return it on time."
  })

  function change(key: string, value: string) {
    setForm((p) => ({
      ...p,
      [key]: value
    }))
  }

  function openImageDialog() {
    setDraftImage(image)
    setImagePreviewError(false)
    setImageDialogOpen(true)
  }

  function addImageUrl() {
    const value = draftImage.trim()

    try {
      const parsedUrl = new URL(value)

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid image URL")
      }

      if (value.length > 2000) {
        toast.error("Image URL must be shorter than 2000 characters.")
        return
      }

      setImage(value)
      setImageDialogOpen(false)
      setImagePreviewError(false)

      toast.success("Equipment image URL added")
    } catch {
      toast.error(
        "Enter a valid image URL starting with https:// or http://"
      )
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()

    if (!image) {
      toast.error("Add an equipment image URL first.")
      return
    }

    setBusy(true)

    try {
      await apiPost(
        "/api/equipment",
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
          image,
          rentalTerms: form.rentalTerms
        },
        true
      )

      toast.success("Equipment submitted for admin approval")
      router.push("/dashboard/owner/equipment")
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "Could not submit equipment"
      )
    } finally {
      setBusy(false)
    }
  }

  const canPreview = /^https?:\/\//i.test(draftImage.trim())

  return (
    <>
      <PageTitle
        eyebrow="OWNER"
        title="Add equipment"
        description="Create a clear, accurate listing so customers can find and book your equipment."
      />

      <form
        onSubmit={submit}
        className="grid gap-6 xl:grid-cols-[1fr_330px]"
      >
        <Card>
          <CardBody className="space-y-5 p-6">
            <div>
              <h2 className="font-extrabold">
                Equipment details
              </h2>

              <p className="mt-1 text-xs text-muted">
                Fields marked with * are required.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Equipment name *</Label>

                <Input
                  required
                  minLength={3}
                  value={form.name}
                  onChange={(e) => change("name", e.target.value)}
                  placeholder="e.g. CAT 320 Hydraulic Excavator"
                />
              </div>

              <div className="sm:col-span-2">
                <Label>Description *</Label>

                <Textarea
                  required
                  minLength={20}
                  value={form.description}
                  onChange={(e) => change("description", e.target.value)}
                  placeholder="Describe the equipment, its use and what is included…"
                />
              </div>

              <div>
                <Label>Category *</Label>

                <Select
                  value={form.category}
                  onChange={(e) => change("category", e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.name}>
                      {c.name}
                    </option>
                  ))}

                  <option>Other</option>
                </Select>
              </div>

              <div>
                <Label>Condition *</Label>

                <Select
                  value={form.condition}
                  onChange={(e) => change("condition", e.target.value)}
                >
                  <option>New</option>
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Fair</option>
                </Select>
              </div>

              <div>
                <Label>Brand</Label>

                <Input
                  value={form.brand}
                  onChange={(e) => change("brand", e.target.value)}
                  placeholder="Manufacturer"
                />
              </div>

              <div>
                <Label>Model</Label>

                <Input
                  value={form.model}
                  onChange={(e) => change("model", e.target.value)}
                  placeholder="Model name"
                />
              </div>

              <div>
                <Label>City *</Label>

                <Input
                  required
                  value={form.city}
                  onChange={(e) => change("city", e.target.value)}
                  placeholder="Dhaka"
                />
              </div>

              <div>
                <Label>Full location/address *</Label>

                <Input
                  required
                  value={form.address}
                  onChange={(e) => change("address", e.target.value)}
                  placeholder="Area, road and address"
                />
              </div>

              <div>
                <Label>Latitude (optional, for nearby map)</Label>

                <Input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => change("latitude", e.target.value)}
                  placeholder="23.8103"
                />
              </div>

              <div>
                <Label>Longitude (optional, for nearby map)</Label>

                <Input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => change("longitude", e.target.value)}
                  placeholder="90.4125"
                />
              </div>

              <div>
                <Label>Rental price (BDT) *</Label>

                <Input
                  required
                  type="number"
                  min="1"
                  value={form.rentalPrice}
                  onChange={(e) => change("rentalPrice", e.target.value)}
                  placeholder="5000"
                />
              </div>

              <div>
                <Label>Rental type *</Label>

                <Select
                  value={form.rentalType}
                  onChange={(e) => change("rentalType", e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </Select>
              </div>

              <div>
                <Label>Available quantity *</Label>

                <Input
                  required
                  type="number"
                  min="1"
                  value={form.availableQuantity}
                  onChange={(e) => change("availableQuantity", e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <Label>Rental terms</Label>

                <Textarea
                  value={form.rentalTerms}
                  onChange={(e) => change("rentalTerms", e.target.value)}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardBody className="p-5">
              <h3 className="font-extrabold">
                Equipment image *
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted">
                Add a direct image URL for your equipment.
              </p>

              <button
                type="button"
                onClick={openImageDialog}
                className="mt-4 flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-4 py-8 text-center transition hover:border-[var(--orange)]"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-[var(--orange-soft)] text-[var(--orange)]">
                  <ImagePlus size={23} />
                </span>

                <span className="mt-3 text-sm font-bold">
                  {image ? "Change image URL" : "Add image URL"}
                </span>

                <span className="mt-1 text-[10px] text-muted">
                  Paste a JPG, PNG or WEBP image link
                </span>
              </button>

              {image && (
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 size={15} />
                  Image URL added
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-5">
              <h3 className="font-extrabold">
                Before you submit
              </h3>

              <ul className="mt-3 space-y-3 text-xs leading-5 text-muted">
                <li>
                  • Use accurate equipment details and a real location.
                </li>

                <li>
                  • Set a fair rental price and available quantity.
                </li>

                <li>
                  • Your listing starts as Pending and needs admin approval.
                </li>
              </ul>

              <Button
                type="submit"
                disabled={busy}
                size="lg"
                className="mt-5 w-full"
              >
                {busy ? "Submitting…" : "Submit for approval"}
                <UploadCloud size={16} />
              </Button>
            </CardBody>
          </Card>
        </div>
      </form>

      <Dialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
      >
        <DialogContent className="bg-white text-zinc-950 shadow-xl dark:bg-zinc-900 dark:text-zinc-50 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Add equipment image
            </DialogTitle>

            <DialogDescription>
              Paste a direct image URL. The link should open the image
              itself, not an entire webpage.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="equipment-image-url">
                Image URL
              </Label>

              <Input
                id="equipment-image-url"
                type="url"
                value={draftImage}
                onChange={(e) => {
                  setDraftImage(e.target.value)
                  setImagePreviewError(false)
                }}
                placeholder="https://example.com/equipment.jpg"
                className="mt-2"
              />
            </div>

            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
              {canPreview ? (
                <img
                  src={draftImage.trim()}
                  alt="Equipment image preview"
                  loading="lazy"
                  className="max-h-56 w-full rounded-lg object-contain"
                  onError={() => setImagePreviewError(true)}
                  onLoad={() => setImagePreviewError(false)}
                />
              ) : (
                <div className="grid min-h-36 place-items-center text-center">
                  <div>
                    <ImagePlus
                      size={28}
                      className="mx-auto text-muted"
                    />

                    <p className="mt-2 text-xs text-muted">
                      Image preview will appear here
                    </p>
                  </div>
                </div>
              )}

              {imagePreviewError && (
                <p className="mt-2 text-center text-xs text-red-600">
                  Could not load this image. Check whether the URL is
                  a public direct image link.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setImageDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={addImageUrl}
              disabled={!canPreview || imagePreviewError}
            >
              <CheckCircle2 size={15} />
              Use this image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
