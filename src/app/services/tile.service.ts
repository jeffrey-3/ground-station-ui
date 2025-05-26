import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap, takeWhile } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TileService {
  private readonly SERVER_URL = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  preloadTiles(lat: number, lon: number, sizeMeters: number, minZoom: number, maxZoom: number): Observable<any> {
    return this.http.post(`${this.SERVER_URL}/preload`, {
      lat,
      lon,
      size: sizeMeters,
      min_zoom: minZoom,
      max_zoom: maxZoom
    });
  }

  checkStatus(): Observable<any> {
    return this.http.get(`${this.SERVER_URL}/status`);
  }

  cancelDownload(): Observable<any> {
    return this.http.post(`${this.SERVER_URL}/cancel`, {});
  }

  monitorProgress(pollInterval = 1000): Observable<any> {
    return interval(pollInterval).pipe(
      switchMap(() => this.checkStatus()),
      takeWhile((status: any) => status.is_active && status.completed < status.total, true)
    );
  }
}
