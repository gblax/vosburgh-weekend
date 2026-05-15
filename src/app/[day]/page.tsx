import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { DayView } from "@/components/DayView";
import { isValidDay } from "@/lib/days";
import type { ItineraryEvent } from "@/types/event";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function DayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day } = await params;
  if (!isValidDay(day)) notFound();

  const supabase = createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("day", day)
    .order("start_time", { ascending: true });

  return <DayView day={day} initialEvents={(data ?? []) as ItineraryEvent[]} />;
}
