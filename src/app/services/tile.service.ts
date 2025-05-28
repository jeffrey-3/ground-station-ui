import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap, takeWhile } from 'rxjs';

interface PreloadResponse {
  message: string;
  success: boolean;
}

interface StatusResponse {
  is_active: boolean;
  completed: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class TileService {
  private readonly SERVER_URL = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  preloadTiles(lat: number, lon: number, sizeMeters: number, minZoom: number, maxZoom: number): Observable<PreloadResponse> {
    return this.http.post<PreloadResponse>(`${this.SERVER_URL}/preload`, {
      lat,
      lon,
      size: sizeMeters,
      min_zoom: minZoom,
      max_zoom: maxZoom
    });
  }

  checkStatus(): Observable<StatusResponse> {
    return this.http.get<StatusResponse>(`${this.SERVER_URL}/status`);
  }

  cancelDownload(): Observable<PreloadResponse> {
    return this.http.post<PreloadResponse>(`${this.SERVER_URL}/cancel`, {});
  }

  monitorProgress(pollInterval = 1000): Observable<StatusResponse> {
    return interval(pollInterval).pipe(
      switchMap(() => this.checkStatus()),
      takeWhile(status => status.is_active && status.completed < status.total, true)
    );
  }
}
