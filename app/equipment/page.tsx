"use client"

import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
} from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EquipmentCard } from "@/components/equipment-card"
import { Button } from "@/components/ui/button"
import { Input, Select } from "@/components/ui/field"
import { apiGet } from "@/lib/api"
import { CATEGORIES, DEMO_EQUIPMENT } from "@/lib/constants"
import { makeQuery } from "@/lib/utils"
import type { Equipment, PageResult } from "@/lib/types"

type DemoEquipment = {
  name?: string
  category?: string
  location?: {
    city?: string
    address?: string
  }
}

export default function EquipmentPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [rentalType, setRentalType] = useState("")
  const [sort, setSort] = useState("recent")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [availableOnly, setAvailableOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [mobileFilters, setMobileFilters] = useState(false)
  const [location, setLocation] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    setSearch(params.get("search") || "")
    setCategory(params.get("category") || "")
    setLocation(params.get("location") || "")
  }, [])

  const query = useMemo(
    () =>
      makeQuery({
        search: [search, location].filter(Boolean).join(" "),
        category,
        rentalType,
        sort,
        minPrice,
        maxPrice,
        availableOnly: availableOnly ? "true" : undefined,
        page,
        limit: 9,
      }),
    [
      search,
      location,
      category,
      rentalType,
      sort,
      minPrice,
      maxPrice,
      availableOnly,
      page,
    ]
  )

  const { data, isLoading, isError } = useQuery({
    queryKey: ["equipment", query],
    queryFn: async () => apiGet<PageResult<Equipment>>(`/api/equipment?${query}`),
    retry: 0,
  })

  const demoItems = (DEMO_EQUIPMENT as unknown as DemoEquipment[])
    .filter((equipment) => {
      const matchesCategory = !category || equipment.category === category
      const searchText = [search, location]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      const equipmentText = [
        equipment.name,
        equipment.category,
        equipment.location?.city,
        equipment.location?.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return matchesCategory && (!searchText || equipmentText.includes(searchText))
    })
    .slice(0, 9) as unknown as Equipment[]

  const items: Equipment[] = data?.items ?? (isError ? demoItems : [])
  const totalPages = data?.pagination?.totalPages || 1
  const totalResults = data?.pagination?.total ?? items.length

  function clearFilters() {
    setCategory("")
    setRentalType("")
    setMinPrice("")
    setMaxPrice("")
    setAvailableOnly(false)
    setSearch("")
    setLocation("")
    setPage(1)
  }

  return (
    <>
      <Navbar />

      <main>
        <div className="relative overflow-hidden bg-[#14243c] py-16 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(244,119,50,.22),transparent_35%)]" />

          <div className="container-shell relative">
            <p className="section-kicker">Explore the marketplace</p>

            <h1 className="mt-3 max-w-2xl text-4xl font-black tracking-[-.055em] sm:text-5xl">
              Find the right gear.
              <br />
              <span className="text-orange-300">Get more done.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Browse dependable equipment from local owners, compare your options and book with confidence.
            </p>

            <div className="mt-8 flex max-w-2xl items-center gap-2 rounded-2xl bg-white p-2">
              <Search size={19} className="ml-3 text-orange-500" />

              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Search excavators, cameras, generators…"
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-slate-900 outline-none"
              />

              <Button onClick={() => setPage(1)}>Search</Button>
            </div>
          </div>
        </div>

        <section className="container-shell py-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Marketplace</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                All equipment
              </h2>
              <p className="mt-2 text-sm text-muted">
                Find your fit across verified listings.
              </p>
            </div>

            <button
              onClick={() => setMobileFilters(!mobileFilters)}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs font-bold lg:hidden"
            >
              <SlidersHorizontal size={15} />
              Filters
            </button>
          </div>

          <div className="grid gap-7 lg:grid-cols-[250px_1fr]">
            <aside
              className={`${mobileFilters ? "block" : "hidden"} h-fit rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 lg:sticky lg:top-24 lg:block`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-[var(--orange)]"
                >
                  Clear all
                </button>
              </div>

              <div className="mt-6">
                <label className="label">Category</label>

                <div className="space-y-3">
                  {CATEGORIES.map((item) => (
                    <label
                      key={item.name}
                      className="flex cursor-pointer items-center gap-2.5 text-xs text-muted"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={category === item.name}
                        onChange={() => {
                          setCategory(item.name)
                          setPage(1)
                        }}
                        className="accent-orange-500"
                      />
                      {item.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="label">Rental type</label>
                <Select
                  value={rentalType}
                  onChange={(event) => {
                    setRentalType(event.target.value)
                    setPage(1)
                  }}
                >
                  <option value="">All rental types</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </Select>
              </div>

              <div className="mt-6">
                <label className="label">Price range (৳)</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                  />
                  <Input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                  />
                </div>

                <Button
                  className="mt-2 w-full"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(1)}
                >
                  Apply price
                </Button>
              </div>

              <div className="mt-6 border-t border-[var(--border)] pt-5">
                <label className="flex cursor-pointer items-center justify-between text-xs font-semibold">
                  <span>Available now</span>
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(event) => {
                      setAvailableOnly(event.target.checked)
                      setPage(1)
                    }}
                    className="size-4 accent-orange-500"
                  />
                </label>
              </div>
            </aside>

            <div>
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <p className="text-xs text-muted">
                  {totalResults} equipment results
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted">Sort by</span>

                  <Select
                    value={sort}
                    onChange={(event) => {
                      setSort(event.target.value)
                      setPage(1)
                    }}
                    className="w-[180px] py-2 text-xs"
                  >
                    <option value="recent">Recently added</option>
                    <option value="price_asc">Price: low to high</option>
                    <option value="price_desc">Price: high to low</option>
                    <option value="rating">Top rated</option>
                    <option value="popular">Most popular</option>
                  </Select>
                </div>
              </div>

              {isError && (
                <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
                  Showing sample marketplace listings because the GearHub API is not reachable. Connect your backend to load live equipment.
                </div>
              )}

              {isLoading ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((number) => (
                    <div
                      key={number}
                      className="h-[365px] animate-pulse rounded-2xl bg-[var(--surface-muted)]"
                    />
                  ))}
                </div>
              ) : items.length ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => (
                    <EquipmentCard key={item._id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-16 text-center">
                  <PackageOpen className="mx-auto text-muted" size={32} />
                  <h3 className="mt-4 font-bold">No equipment found</h3>
                  <p className="mt-2 text-sm text-muted">
                    Try a different keyword or remove a few filters.
                  </p>
                </div>
              )}

              <div className="mt-9 flex items-center justify-between border-t border-[var(--border)] pt-5">
                <p className="text-xs text-muted">
                  Page {page} of {totalPages}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    <ChevronLeft size={15} />
                    Previous
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  >
                    Next
                    <ChevronRight size={15} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
