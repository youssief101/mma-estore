import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Fighter,
  FighterListResponse,
  FighterResponse,
} from '../models/fighter.model';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FighterService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/fighters`;

  /**
   * GET /fighters
   */
  getAllFighters(): Observable<FighterListResponse> {
    return this.http.get<FighterListResponse>(this.apiUrl);
  }

  /**
   * GET /fighters/:fighterId
   */
  getFighterById(fighterId: string): Observable<FighterResponse> {
    return this.http.get<FighterResponse>(
      `${this.apiUrl}/${fighterId}`
    );
  }

  /**
   * POST /fighters
   */
  createFighter(
    fighter: Partial<Fighter>
  ): Observable<FighterResponse> {
    return this.http.post<FighterResponse>(
      this.apiUrl,
      fighter
    );
  }

  /**
   * PUT /fighters/:fighterId
   */
  updateFighter(
    fighterId: string,
    fighter: Partial<Fighter>
  ): Observable<FighterResponse> {
    return this.http.put<FighterResponse>(
      `${this.apiUrl}/${fighterId}`,
      fighter
    );
  }

  /**
   * DELETE /fighters/:fighterId
   */
  deleteFighter(fighterId: string): Observable<{
    success: boolean;
    message: string;
  }> {
    return this.http.delete<{
      success: boolean;
      message: string;
    }>(`${this.apiUrl}/${fighterId}`);
  }
}