"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Scale, Plus, X } from "lucide-react";

import { PageTitle } from "@/components/dashboard/page-title";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiGet } from "@/lib/api";
import type { Equipment } from "@/lib/types";
import { formatMoney } from "@/lib/utils";

export default function ComparePage() {
  const [ids, setIds] = useState<string[]>([]);
  const [idInput, setIdInput] = useState("");

  const query = ids.join(",");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["compare-equipment", query],
    queryFn: () =>
      apiGet<Equipment[]>(
        `/api/equipment/compare?ids=${encodeURIComponent(query)}`
      ),
    enabled: ids.length >= 2,
    retry: 0,
  });

  function add() {
    const id = idInput.trim();

    if (!id || ids.includes(id) || ids.length >= 4) return;

    setIds((current) => [...current, id]);
    setIdInput("");
  }

  function remove(id: string) {
    setIds((current) => current.filter((item) => item !== id));
  }

  return (
    <>
      <PageTitle
        eyebrow="SHOPPING TOOLS"
        title="Compare equipment"
        description="Compare pricing, category, condition and availability before choosing your rental."
      />

      <Card className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <Input
            value={idInput}
            onChange={(event) => setIdInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                add();
              }
            }}
            placeholder="Paste an equipment ID from its detail URL"
            aria-label="Equipment ID"
            className="min-w-0 flex-1"
          />

          <Button
            onClick={add}
            disabled={!idInput.trim() || ids.length >= 4}
            className="w-full shrink-0 whitespace-nowrap sm:w-[116px] sm:flex-none"
          >
            <Plus size={16} className="shrink-0" />
            <span className="whitespace-nowrap">Add ID</span>
          </Button>
        </div>

        <p className="mt-2 text-[10px] text-muted">
          Add 2–4 live equipment IDs. You can copy the ID from an equipment detail URL.
        </p>

        {ids.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {ids.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => remove(id)}
                aria-label={`Remove equipment ${id}`}
                className="inline-flex max-w-full items-center gap-2 rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-[10px] font-semibold"
              >
                <span className="break-all">{id}</span>
                <X size={12} className="shrink-0" />
              </button>
            ))}
          </div>
        )}
      </Card>

      {ids.length < 2 ? (
        <div className="mt-8 grid place-items-center rounded-2xl border border-dashed border-[var(--border)] py-16 text-center">
          <Scale size={32} className="text-[var(--orange)]" />
          <h2 className="mt-4 font-bold">Add two or more listings</h2>
          <p className="mt-2 max-w-md text-xs leading-6 text-muted">
            Select equipment from the marketplace, then paste their listing IDs
            here to compare them side by side.
          </p>
        </div>
      ) : isLoading ? (
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
      ) : isError ? (
        <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-10 text-center">
          <h2 className="font-bold">Could not compare equipment</h2>
          <p className="mt-2 text-xs text-muted">
            Check that the IDs are correct and the backend is running, then try again.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data?.map((equipment) => (
            <Card key={equipment._id} className="overflow-hidden">
              <div className="relative aspect-[1.4] bg-[var(--surface-muted)]">
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className="size-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-extrabold">{equipment.name}</h3>
                <p className="mt-1 text-xs text-muted">
                  {equipment.category}
                </p>

                <p className="mt-4 text-xl font-black text-[var(--orange)]">
                  {formatMoney(equipment.rentalPrice)}
                  <span className="ml-1 text-[10px] font-medium text-muted">
                    / {equipment.rentalType}
                  </span>
                </p>

                <div className="mt-4 space-y-2 border-t border-[var(--border)] pt-4 text-xs">
                  <p className="flex justify-between gap-3">
                    <span className="text-muted">Condition</span>
                    <b>{equipment.condition}</b>
                  </p>
                  <p className="flex justify-between gap-3">
                    <span className="text-muted">Available</span>
                    <b>{equipment.availableQuantity}</b>
                  </p>
                  <p className="flex justify-between gap-3">
                    <span className="text-muted">Rating</span>
                    <b>{equipment.averageRating || "—"}</b>
                  </p>
                  <p className="flex justify-between gap-3">
                    <span className="text-muted">Location</span>
                    <b>{equipment.location?.city || "—"}</b>
                  </p>
                </div>

                <Button
                  href={`/equipment/${equipment._id}`}
                  className="mt-5 w-full"
                  size="sm"
                >
                  View details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
