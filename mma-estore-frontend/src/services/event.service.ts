import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Event,
  EventListResponse,
  EventResponse,
} from '../models/event.model';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/events`;

  /**
   * GET /events
   */
  getAllEvents(): Observable<EventListResponse> {
    return this.http.get<EventListResponse>(this.apiUrl);
  }

  /**
   * GET /events/:eventId
   */
  getEventById(eventId: string): Observable<EventResponse> {
    return this.http.get<EventResponse>(
      `${this.apiUrl}/${eventId}`
    );
  }

  /**
   * POST /events
   */
  createEvent(
    event: Partial<Event>
  ): Observable<EventResponse> {
    return this.http.post<EventResponse>(
      this.apiUrl,
      event
    );
  }

  /**
   * PUT /events/:eventId
   */
  updateEvent(
    eventId: string,
    event: Partial<Event>
  ): Observable<EventResponse> {
    return this.http.put<EventResponse>(
      `${this.apiUrl}/${eventId}`,
      event
    );
  }

  /**
   * DELETE /events/:eventId
   */
  deleteEvent(eventId: string): Observable<{
    success: boolean;
    message: string;
  }> {
    return this.http.delete<{
      success: boolean;
      message: string;
    }>(`${this.apiUrl}/${eventId}`);
  }
}