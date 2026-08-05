import { Event } from "./event.model";

export interface EventsResponse {
  success: boolean;
  count: number;
  events: Event[];
}

export interface EventResponse {
  success: boolean;
  event: Event;
}