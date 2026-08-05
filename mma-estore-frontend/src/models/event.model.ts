export interface Event {
  _id: string;

  name: string;

  eventDate: string;

  location: string;

  image: string;

  description: string;

  eventType: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface EventResponse {
  success: boolean;
  event: Event;
}

export interface EventListResponse {
  success: boolean;
  count: number;
  events: Event[];
}