"use client";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LocateFixed, MapPin, Navigation, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/dashboard/page-title";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EquipmentCard } from "@/components/equipment-card";
import { apiGet } from "@/lib/api";
import type { Equipment } from "@/lib/types";

export default function NearbyEquipmentPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState("25000");
  const [locating, setLocating] = useState(false);
  const query = useQuery({
    queryKey: ["nearby-equipment", coords?.lat, coords?.lng, radius],
    queryFn: () => apiGet<Equipment[]>(`/api/equipment/nearby?lat=${coords!.lat}&lng=${coords!.lng}&maxDistance=${radius}`),
    enabled: Boolean(coords),
    retry: 0,
  });
  const mapUrl = useMemo(() => {
    if (!coords) return "";
    const delta = 0.08;
    const bbox = [coords.lng - delta, coords.lat - delta, coords.lng + delta, coords.lat + delta].join(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`;
  }, [coords]);
  function locate() {
    if (!navigator.geolocation) {
      toast.error("Location is not supported by this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocating(false);
      },
      (error) => {
        setLocating(false);
        toast.error(error.code === error.PERMISSION_DENIED ? "Location permission was denied. Enable it in your browser settings." : "Could not get your location. Try again.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }
  return <>
    <PageTitle eyebrow="DISCOVER NEAR YOU" title="Equipment around your location" description="Find approved equipment listed by owners near your current location. Your coordinates are only used for this search." action={<Button onClick={locate} disabled={locating}><LocateFixed size={16}/>{locating ? "Locating…" : coords ? "Refresh location" : "Use my location"}</Button>}/>
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold"><Navigation size={16} className="text-[var(--orange)]"/> Search radius</div>
      <select className="field w-44 py-2" value={radius} onChange={(e) => setRadius(e.target.value)}>
        <option value="5000">Within 5 km</option><option value="10000">Within 10 km</option><option value="25000">Within 25 km</option><option value="50000">Within 50 km</option><option value="100000">Within 100 km</option>
      </select>
      {coords && <span className="text-xs text-muted">Location: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>}
    </div>
    {!coords ? <Card><CardBody className="grid min-h-64 place-items-center text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[var(--orange-soft)] text-[var(--orange)]"><MapPin size={25}/></span><h2 className="mt-4 text-lg font-extrabold">Find equipment nearby</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">Allow location access to search GearHub listings within your selected radius. You can also explore equipment by city on the marketplace page.</p><Button onClick={locate} disabled={locating} className="mt-5"><LocateFixed size={16}/>{locating ? "Locating…" : "Use my location"}</Button></div></CardBody></Card> : <>
      <Card className="mb-6 overflow-hidden"><div className="relative h-[300px] sm:h-[390px]"><iframe title="OpenStreetMap showing your search area" src={mapUrl} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/><a href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=13/${coords.lat}/${coords.lng}`} target="_blank" rel="noreferrer" className="absolute bottom-3 right-3 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow">Open full map</a></div></Card>
      <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="text-xl font-black">Nearby listings</h2><p className="mt-1 text-xs text-muted">Within {Number(radius) / 1000} km of your location</p></div><Button variant="outline" size="sm" onClick={() => query.refetch()}><RefreshCw size={14}/> Refresh results</Button></div>
      {query.isLoading ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{[1,2,3].map((n) => <div key={n} className="h-80 animate-pulse rounded-2xl bg-[var(--surface-muted)]"/>)}</div> : query.isError ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{query.error instanceof Error ? query.error.message : "Nearby search failed."} Listings need owner coordinates to appear on this map.</div> : query.data?.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{query.data.map((item) => <EquipmentCard key={item._id} item={item}/>)}</div> : <Card><CardBody className="py-12 text-center"><h3 className="font-bold">No nearby equipment found</h3><p className="mt-2 text-sm text-muted">Try a wider search radius, or browse all equipment by city.</p><Button href="/equipment" variant="outline" className="mt-4">Browse all equipment</Button></CardBody></Card>}
    </>}
  </>;
}
