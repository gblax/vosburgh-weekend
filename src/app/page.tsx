import { createClient } from "@/lib/supabase";
import { HomeOverview } from "@/components/HomeOverview";
import { TripHeader } from "@/components/TripHeader";
import type { ItineraryEvent } from "@/types/event";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("day", { ascending: true })
    .order("start_time", { ascending: true });
  const events = (data ?? []) as ItineraryEvent[];
  return (
    <>
      <TripHeader />
      <HomeOverview events={events} />
    </>
  );
}
