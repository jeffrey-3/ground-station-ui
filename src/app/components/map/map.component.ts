import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription } from 'rxjs';
import { LandDialogComponent } from '../land-dialog/land-dialog.component';
import { LoiterDialogComponent } from '../loiter-dialog/loiter-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-contextmenu';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  map: any;
  marker: any;
  drawControl: any;
  drawnItems: any;

  private subscription!: Subscription;

  constructor(private webSocketService: WebSocketService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.configMap();

    this.subscription = this.webSocketService.messages$.subscribe(data => {
      var newLatLng = new L.LatLng(data.lat, data.lon);

      this.marker.setLatLng(newLatLng);
      this.marker._icon.style[L.DomUtil.TRANSFORM] += 'rotate(' + data.heading + 'deg)';
      this.marker._icon.style["transform-origin"] = "50% 50%";

      var visible = this.map.getBounds().contains(this.marker.getLatLng());
      if (!visible) {
        this.map.panTo(this.marker.getLatLng());
      }
    });
  }

  configMap() {
    this.map = L.map('map', {
      center: [40.7128, -74.0060],
      zoom: 17,
      zoomControl: false,
      attributionControl: false
    });

    L.control.scale().addTo(this.map);

    this.map.contextmenu.enable();
    this.map.contextmenu.addItem({
      text: 'Land',
      callback: (e: L.LeafletMouseEvent) => this.land(e)
    });
    this.map.contextmenu.addItem({
      text: 'Loiter',
      callback: (e: L.LeafletMouseEvent) => this.loiter(e)
    });

    L.tileLayer("http://localhost:5000/tiles/{z}/{x}/{y}.png", {
      maxNativeZoom: 17,
      maxZoom: 25
    }).addTo(this.map);

    var aircraftIcon = L.icon({
      iconUrl: 'aircraft.png',
      iconSize:     [40, 40], // size of the icon
      iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, -20], // point from which the popup should open relative to the iconAnchor
    });

    this.marker = L.marker([40.7128, -74.0060], {
      icon: aircraftIcon
    }).addTo(this.map);

    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    this.drawControl = new L.Control.Draw({
      draw: {
        polygon: false,
        circle: false,
        circlemarker: false,
        rectangle: false,
        marker: false
      },
      edit: {
        featureGroup: this.drawnItems,
        edit: false,
        remove: false
      }
    }).addTo(this.map);

    this.map.on(L.Draw.Event.CREATED, (e: any) => {
      const dialogRef = this.dialog.open(LoiterDialogComponent, {
        position: {
          top: '30px',
          left: '30px'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.drawnItems.clearLayers();

          const layer = e.layer;
          this.drawnItems.addLayer(layer);

          const latlng = layer.getLatLngs().at(-1);

          L.circle([latlng.lat, latlng.lng], {
            color: '#3388ff',
            opacity: 0.5,
            weight: 4,
            fill: false,
            radius: result.radius
          }).addTo(this.drawnItems);
        }
      });
    });
  }

  land(event: L.LeafletMouseEvent) {
    const latlng = event.latlng;

    const dialogRef = this.dialog.open(LandDialogComponent, {
      position: {
        top: '30px',
        left: '30px'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.drawnItems.clearLayers();

        const finalLegPosition = this.translateLatLon(latlng.lat, latlng.lng, result.extendFinalLeg, result.runwayHeading + 180);

        L.polyline([[latlng.lat, latlng.lng], [finalLegPosition.lat, finalLegPosition.lon]], {
          color: '#3388ff',
          opacity: 0.5
        }).addTo(this.drawnItems);

        var perpendicularBearing;
        if (result.loiterDirection === 'right') {
          perpendicularBearing = result.runwayHeading + 90;
        } else {
          perpendicularBearing = result.runwayHeading - 90
        }
        const loiterPosition = this.translateLatLon(finalLegPosition.lat, finalLegPosition.lon, result.loiterRadius, perpendicularBearing);

        L.circle([loiterPosition.lat, loiterPosition.lon], {
          color: '#3388ff',
          opacity: 0.5,
          weight: 4,
          fill: false,
          radius: result.loiterRadius
        }).addTo(this.drawnItems);
      }
    });
  }

  loiter(event: L.LeafletMouseEvent) {
    const latlng = event.latlng;

    const dialogRef = this.dialog.open(LoiterDialogComponent, {
      position: {
        top: '30px',
        left: '30px'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.drawnItems.clearLayers();

        L.circle([latlng.lat, latlng.lng], {
          color: '#3388ff',
          opacity: 0.5,
          weight: 4,
          fill: false,
          radius: result.radius
        }).addTo(this.drawnItems);
      }
    });
  }

  translateLatLon(lat: number, lon: number, distance: number, bearing: number) {
    const R = 6371000;
    const latRad = lat * Math.PI / 180;
    const lonRad = lon * Math.PI / 180;
    const bearingRad = bearing * Math.PI / 180;
    
    const newLatRad = Math.asin(
      Math.sin(latRad) * Math.cos(distance / R) + 
      Math.cos(latRad) * Math.sin(distance / R) * Math.cos(bearingRad)
    );
    
    const newLonRad = lonRad + Math.atan2(
      Math.sin(bearingRad) * Math.sin(distance / R) * Math.cos(latRad),
      Math.cos(distance / R) - Math.sin(latRad) * Math.sin(newLatRad)
    );
    
    return {
      lat: newLatRad * 180 / Math.PI,
      lon: newLonRad * 180 / Math.PI
    };
  }
}