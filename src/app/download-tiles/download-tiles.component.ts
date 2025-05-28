import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { TileService } from '../services/tile.service';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-download-tiles',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './download-tiles.component.html',
  styleUrl: './download-tiles.component.scss'
})
export class DownloadTilesComponent implements OnDestroy {
  lat = 40.7128; // Default: New York
  lon = -74.0060;
  sizeMeters = 5000;
  minZoom = 10;
  maxZoom = 15;
  
  isLoading = false;
  statusMessage = '';
  progress = 0;
  total = 0;
  
  private progressSubscription?: Subscription;

  constructor(private tileService: TileService) { }

  ngOnDestroy(): void {
    this.progressSubscription?.unsubscribe();
  }

  startPreloading(): void {
    if (this.minZoom > this.maxZoom) {
      this.statusMessage = 'Error: Min zoom must be less than or equal to max zoom';
      return;
    }
    
    this.isLoading = true;
    this.statusMessage = 'Starting tile preload...';
    this.progress = 0;
    this.total = 0;

    console.log("preload lat: %f lon: %f size: %d min: %d max: %d", 
      this.lat, this.lon, this.sizeMeters, this.minZoom, this.maxZoom);
    
    this.tileService.preloadTiles(this.lat, this.lon, this.sizeMeters, this.minZoom, this.maxZoom)
      .subscribe({
        next: (response) => {
          this.statusMessage = response.message;
          this.monitorProgress();
        },
        error: (err) => {
          this.statusMessage = `Error: ${err.message}`;
          this.isLoading = false;
        }
      });
  }

  monitorProgress(): void {
    this.progressSubscription = this.tileService.monitorProgress()
      .subscribe({
        next: (status) => {
          this.progress = status.completed;
          this.total = status.total;
          
          if (!status.is_active || status.completed >= status.total) {
            this.isLoading = false;
            this.statusMessage = 'Tile preloading completed successfully!';
          }
        },
        error: (err) => {
          this.statusMessage = `Error monitoring progress: ${err.message}`;
          this.isLoading = false;
        }
      });
  }

  cancelPreloading(): void {
    this.tileService.cancelDownload()
      .subscribe({
        next: (response) => {
          this.statusMessage = response.message;
          this.isLoading = false;
          this.progressSubscription?.unsubscribe();
        },
        error: (err) => {
          this.statusMessage = `Error canceling download: ${err.message}`;
        }
      });
  }
}
