export type EventDay =
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"
  | "monday";

export type EventCategory =
  | "meal"
  | "activity"
  | "travel"
  | "lodging"
  | "drinks"
  | "free_time";

export interface ItineraryEvent {
  id: string;
  day: EventDay;
  start_time: string;
  end_time: string | null;
  title: string;
  location: string | null;
  address: string | null;
  notes: string | null;
  category: EventCategory;
  link_url: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export type NewItineraryEvent = Omit<
  ItineraryEvent,
  "id" | "created_at" | "updated_at"
>;
