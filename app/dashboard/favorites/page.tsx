
"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { PageTitle } from "@/components/dashboard/page-title"
import { Button } from "@/components/ui/button"
import { EquipmentCard } from "@/components/equipment-card"
import { EmptyState } from "@/components/empty-state"

import { apiDelete, apiGet } from "@/lib/api"
import type { Equipment } from "@/lib/types"

export default function FavoritesPage() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => apiGet<Equipment[]>("/api/favorites", true)
  })

  async function remove(id: string) {
    try {
      await apiDelete(`/api/favorites/${id}`)

      toast.success("Removed from favorites")
      qc.invalidateQueries({ queryKey: ["favorites"] })
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not remove favorite"
      )
    }
  }

  return (
    <>
      <PageTitle
        eyebrow="CUSTOMER"
        title="Your favorites"
        description="A shortlist of equipment you want to come back to."
        action={
          <Button href="/equipment" variant="outline">
            Explore equipment
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((x) => (
            <div
              key={x}
              className="h-80 animate-pulse rounded-2xl bg-[var(--surface-muted)]"
            />
          ))}
        </div>
      ) : data?.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((item) => (
            <div key={item._id}>
              <EquipmentCard item={item} />

              <Button
                className="mt-2 w-full"
                size="sm"
                variant="outline"
                onClick={() => remove(item._id)}
              >
                Remove from favorites
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nothing saved just yet"
          description="Tap the heart on any equipment listing to save it here for later."
        />
      )}
    </>
  )
}
