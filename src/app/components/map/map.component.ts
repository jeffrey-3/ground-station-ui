import { Component, ElementRef, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  // Map settings
  private zoom = 10;
  private maxZoom = 18;
  private minZoom = 1;
  private tileSize = 256;
  
  // Position in pixels
  private x = 0;
  private y = 0;
  
  // Geographic coordinates
  private initialLat = 40.7128; // Default: London
  private initialLon = -74.0060;
  
  private container!: HTMLElement;
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private tileCache = new Map<string, HTMLImageElement>();

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.container = this.el.nativeElement.querySelector('.map-container');
    this.setInitialPosition();
    this.renderTiles();
  }

  // Convert lat/lon to pixel coordinates at current zoom
  private latLonToPixel(lat: number, lon: number): { x: number, y: number } {
    const siny = Math.min(Math.max(Math.sin(lat * Math.PI / 180), -0.9999), 0.9999);
    
    const x = 128 + lon * (256 / 360);
    const y = 128 + 0.5 * Math.log((1 + siny) / (1 - siny)) * -(256 / (2 * Math.PI));
    
    const scale = Math.pow(2, this.zoom);
    return {
      x: x * scale,
      y: y * scale
    };
  }

  // Convert pixel coordinates to lat/lon
  private pixelToLatLon(x: number, y: number): { lat: number, lon: number } {
    const scale = Math.pow(2, this.zoom);
    const xScaled = x / scale;
    const yScaled = y / scale;
    
    const lon = (xScaled - 128) / (256 / 360);
    const latRad = (yScaled - 128) / -(256 / (2 * Math.PI));
    const lat = 180 / Math.PI * (2 * Math.atan(Math.exp(latRad)) - Math.PI / 2);
    
    return { lat, lon };
  }

  // Set initial position based on lat/lon
  private setInitialPosition(): void {
    const centerPixel = this.latLonToPixel(this.initialLat, this.initialLon);
    this.x = centerPixel.x - this.container.clientWidth / 2;
    this.y = centerPixel.y - this.container.clientHeight / 2;
  }

  // Get current center position in lat/lon
  public getCenter(): { lat: number, lon: number } {
    const centerX = this.x + this.container.clientWidth / 2;
    const centerY = this.y + this.container.clientHeight / 2;
    return this.pixelToLatLon(centerX, centerY);
  }

  // Set view to specific lat/lon and zoom
  public setView(lat: number, lon: number, zoom?: number): void {
    if (zoom !== undefined) {
      this.zoom = Math.min(Math.max(zoom, this.minZoom), this.maxZoom);
    }
    
    const centerPixel = this.latLonToPixel(lat, lon);
    this.x = centerPixel.x - this.container.clientWidth / 2;
    this.y = centerPixel.y - this.container.clientHeight / 2;
    
    this.renderTiles();
  }

  private getTileUrl(z: number, x: number, y: number): string {
    return `http://localhost:5000/tiles/${z}/${x}/${y}.png`;
  }

  private renderTiles(): void {
    this.container.innerHTML = '';
    const tileCount = Math.pow(2, this.zoom);

    // Calculate visible tile range
    const tileMinX = Math.max(0, Math.floor(this.x / this.tileSize));
    const tileMaxX = Math.min(tileCount, Math.ceil((this.x + this.container.clientWidth) / this.tileSize));
    const tileMinY = Math.max(0, Math.floor(this.y / this.tileSize));
    const tileMaxY = Math.min(tileCount, Math.ceil((this.y + this.container.clientHeight) / this.tileSize));

    // Create tiles
    for (let x = tileMinX; x < tileMaxX; x++) {
      for (let y = tileMinY; y < tileMaxY; y++) {
        this.createTile(x, y);
      }
    }
  }

  private createTile(x: number, y: number): void {
    const tileKey = `${this.zoom}/${x}/${y}`;
    
    // Check cache first
    if (this.tileCache.has(tileKey)) {
      const cachedImg = this.tileCache.get(tileKey)!;
      this.positionTile(cachedImg, x, y);
      this.container.appendChild(cachedImg);
      return;
    }

    const img = new Image();
    img.className = 'map-tile';
    img.src = this.getTileUrl(this.zoom, x, y);
    img.alt = `Map tile ${tileKey}`;
    
    img.onload = () => {
      img.classList.add('loaded');
      this.tileCache.set(tileKey, img);
    };
    
    img.onerror = () => {
      console.error(`Failed to load tile: ${tileKey}`);
      img.style.backgroundColor = '#f0f0f0';
    };

    this.positionTile(img, x, y);
    this.container.appendChild(img);
  }

  private positionTile(img: HTMLImageElement, x: number, y: number): void {
    Object.assign(img.style, {
      width: `${this.tileSize}px`,
      height: `${this.tileSize}px`,
      position: 'absolute',
      left: `${x * this.tileSize - this.x}px`,
      top: `${y * this.tileSize - this.y}px`,
      pointerEvents: 'none'
    });
  }

  // Zoom controls
  public zoomIn(): void {
    if (this.zoom < this.maxZoom) {
      const center = this.getCenter();
      this.zoom++;
      this.setView(center.lat, center.lon);
    }
  }

  public zoomOut(): void {
    if (this.zoom > this.minZoom) {
      const center = this.getCenter();
      this.zoom--;
      this.setView(center.lat, center.lon);
    }
  }

  // Panning controls - FIXED DRAGGING (REVERSED)
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.startX = event.clientX + this.x;
    this.startY = event.clientY + this.y;
    this.container.style.cursor = 'grabbing';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      this.x = this.startX - event.clientX;
      this.y = this.startY - event.clientY;
      this.renderTiles();
    }
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    this.isDragging = false;
    this.container.style.cursor = 'grab';
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.isDragging = false;
    this.container.style.cursor = 'grab';
  }
}