import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription } from 'rxjs';
import { LandDialogComponent } from '../land-dialog/land-dialog.component';
import { LoiterDialogComponent } from '../loiter-dialog/loiter-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-contextmenu';;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, OnDestroy {
  map: any;
  marker: any;
  drawControl: any;
  drawnItems: any;

  private subscription!: Subscription;

  constructor(
    private webSocketService: WebSocketService, 
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.configMap();

    if (this.webSocketService.isOpen()) {
      this.webSocketService.send({
        type: 'get_current_mission'
      });
      console.log("Requested current mission...");
    }

    this.webSocketService.socketOpen$.subscribe(() => {
      this.webSocketService.send({
        type: 'get_current_mission'
      });
      console.log("Requested current mission...");
    });

    this.subscription = this.webSocketService.messages$.subscribe(data => {
      console.log(data.type);
      if (data.type === "vehicle_status") {
        var newLatLng = new L.LatLng(data.lat, data.lon);

        this.marker.setLatLng(newLatLng);
        this.marker._icon.style[L.DomUtil.TRANSFORM] += 'rotate(' + data.yaw + 'deg)';
        this.marker._icon.style["transform-origin"] = "50% 50%";
      } else if (data.type === "mission") {
        this.drawnItems.clearLayers();

        if (data.data[0].type === "waypoint") {
          const points: [number, number][] = []
        
          data.data.forEach((point: any) => {
            points.push([point.lat, point.lon]);
          });
            
          this.drawPath(points, data.data[0].radius);
        } else if (data.data[0].type === "loiter") {
          this.drawLoiter(data.data[0].lat, data.data[0].lon, data.data[0].radius);
        } else if (data.data[0].type === "land") {
          console.log(data.data)
          this.drawLand(
            data.data[0].lat,
            data.data[0].lon,
            data.data[0].runway_heading,
            data.data[0].final_leg,
            data.data[0].radius,
            data.data[0].direction
          );
        }
      }

      var visible = this.map.getBounds().contains(this.marker.getLatLng());
      if (!visible) {
        this.map.panTo(this.marker.getLatLng());
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
          const layer = e.layer;
          const points = layer.getLatLngs();
          const pointArray = points.map((latlng: L.LatLng) => [latlng.lat, latlng.lng]);
          this.commandPath(pointArray, result.radius);
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
      if (result) {
        this.commandLand(
          latlng.lat,
          latlng.lng, 
          result.extendFinalLeg, 
          result.glideslopeAngle, 
          result.runwayHeading, 
          result.loiterRadius, 
          result.loiterDirection
        );
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
        this.commandLoiter(latlng.lat, latlng.lng, result.radius);
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

  drawLoiter(lat: number, lon: number, radius: number) {
    L.circle([lat, lon], {
      color: '#3388ff',
      opacity: 0.5,
      weight: 4,
      fill: false,
      radius: radius
    }).addTo(this.drawnItems);
  }

  drawPath(points: number[][], radius: number) {
    L.polyline(points as L.LatLngTuple[], {
      color: '#3388ff',
      opacity: 0.5,
      weight: 4
    }).addTo(this.drawnItems);

    this.drawLoiter(points[points.length - 1][0], points[points.length - 1][1], radius);
  }

  drawLand(lat: number, lon: number, runwayHeading: number, finalLeg: number, radius: number, direction: string) {
    console.log([lat, lon])

    const finalLegPosition = this.translateLatLon(lat, lon, finalLeg, runwayHeading + 180);

    L.polyline([[lat, lon], [finalLegPosition.lat, finalLegPosition.lon]], {
      color: '#3388ff',
      opacity: 0.5,
      weight: 4
    }).addTo(this.drawnItems);

    var perpendicularBearing;
    if (direction === 'right') {
      perpendicularBearing = runwayHeading + 90;
    } else {
      perpendicularBearing = runwayHeading - 90
    }
    const loiterPosition = this.translateLatLon(finalLegPosition.lat, finalLegPosition.lon, radius, perpendicularBearing);

    this.drawLoiter(loiterPosition.lat, loiterPosition.lon, radius);
  }

  commandLoiter(lat: number, lon: number, radius: number) {
    this.webSocketService.send({
      type: "send_mission",
      data: [{
        type: "loiter",
        lat: lat,
        lon: lon,
        radius: radius,
        direction: 0,
        final_leg: 0,
        glideslope: 0,
        runway_heading: 0
      }]
    });
  }

  commandPath(points: number[][], radius: number) {
    var data: any[] = [];

    points.forEach(point => {
      data.push({
        type: "waypoint",
        lat: point[0],
        lon: point[1],
        radius: radius,
        direction: 0,
        final_leg: 0,
        glideslope: 0,
        runway_heading: 0
      });
    });
    
    this.webSocketService.send({
      type: "send_mission",
      data: data
    });
  }

  commandLand(lat: number, lon: number, finalLeg: number, glideslope: number, heading: number, radius: number, direction: string) {
    this.webSocketService.send({
      type: "send_mission",
      data: [{
        type: "land",
        lat: lat,
        lon: lon,
        radius: radius,
        direction: direction,
        final_leg: finalLeg,
        glideslope: glideslope,
        runway_heading: heading
      }]
    });
  }
}